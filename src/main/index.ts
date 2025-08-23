import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import * as Sentry from '@sentry/electron/main'
import { app, autoUpdater, BrowserWindow, ipcMain, shell } from 'electron'
import path, { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { setupAutoUpdater } from './updater'

const env = import.meta.env.VITE_REACT_APP_ENV_VALUE
Sentry.init({
  dsn: 'https://8b0ea8534fe0026e32065cc94267aeb0@o4509627286618112.ingest.de.sentry.io/4509627337211984',
  release: app.getVersion(),
  environment: env,
  beforeSend(event) {
    // Add additional context for main process errors
    if (event.tags) {
      event.tags.process = 'main'
    } else {
      event.tags = { process: 'main' }
    }
    return event
  }
})

// Global error handlers for main process
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  Sentry.captureException(error, {
    tags: { errorType: 'uncaughtException', process: 'main' }
  })
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  Sentry.captureException(reason instanceof Error ? reason : new Error(String(reason)), {
    tags: { errorType: 'unhandledRejection', process: 'main' },
    extra: { promise: promise.toString() }
  })
})

let mainWindow: BrowserWindow

function createWindow(): void {
  try {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      icon: path.join(__dirname, '../resources/app_icon_256.ico'), // Adjust path as needed
      show: true,
      autoHideMenuBar: true,

      // fullscreen: true,
      resizable: true,
      fullscreenable: true,
      frame: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    mainWindow.on('ready-to-show', () => {
      mainWindow.show()
    })

    // Add error handling for window events
    mainWindow.on('unresponsive', () => {
      console.error('Window became unresponsive')
      Sentry.captureMessage('Window became unresponsive', 'warning')
    })

    mainWindow.webContents.on('render-process-gone', (event, details) => {
      console.error('Render process gone:', { event, details })
      Sentry.captureException(new Error('Render process gone'), {
        tags: { errorType: 'renderProcessGone', process: 'main' },
        extra: { details }
      })
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
    setupAutoUpdater(mainWindow)
  } catch (error) {
    console.error('Error creating window:', error)
    Sentry.captureException(error, {
      tags: { errorType: 'windowCreationError', process: 'main' }
    })
    throw error // Re-throw to maintain original behavior
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  
  // Handle preload errors
  ipcMain.on('preload-error', (_, errorData) => {
    console.error('Preload script error:', errorData)
    const error = new Error(errorData.message)
    error.name = errorData.name
    error.stack = errorData.stack
    Sentry.captureException(error, {
      tags: { errorType: 'preloadError', process: 'preload' }
    })
  })
  
  // With this:
  ipcMain.on('get-app-version', (event) => {
    try {
      // IMPORTANT: For sendSync, you MUST set event.returnValue
      event.returnValue = app.getVersion()
    } catch (error) {
      console.error('Error getting app version:', error)
      Sentry.captureException(error, {
        tags: { errorType: 'ipcError', process: 'main', ipcChannel: 'get-app-version' }
      })
      event.returnValue = '1.0.0' // fallback version
    }
  })
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('restart-app', () => {
  try {
    autoUpdater.quitAndInstall()
  } catch (error) {
    console.error('Error restarting app:', error)
    Sentry.captureException(error, {
      tags: { errorType: 'ipcError', process: 'main', ipcChannel: 'restart-app' }
    })
  }
})

// Add app-level error handlers
app.on('web-contents-created', (_, contents) => {
  contents.on('did-fail-load', (_, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', { errorCode, errorDescription, validatedURL })
    Sentry.captureException(new Error(`Failed to load: ${errorDescription}`), {
      tags: { errorType: 'loadError', process: 'main' },
      extra: { errorCode, errorDescription, validatedURL }
    })
  })
})
