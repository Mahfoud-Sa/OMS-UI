import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
const path = require('path')
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true
// autoUpdater.forceDevUpdateConfig = true
autoUpdater.forceDevUpdateConfig = true

let mainWindow: BrowserWindow

function createWindow(): void {
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
    mainWindow.webContents.send('AppVersion', app.getVersion())
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
}

autoUpdater.on('update-available', (info) => {
  console.log('✅ An update is available. Details for debugging:')
  console.log('Version:', info.version)
  console.log('Release Date:', info.releaseDate) // Check if the version string ends with the letter 's'.
  if (info.version.endsWith('s')) {
    // If it does, this is a special version.
    console.log('✅ OK: This is a special release version.')

    // You can now proceed with the download for this special version.
    // For example, you might decide to download it automatically.
    console.log('Starting download for special version...')
    autoUpdater.downloadUpdate()
  } else {
    // If it does not end with 's', it's a standard version.
    console.log('ℹ️ NOTE: No Update Availabe.')

    // For standard versions, you might decide to do nothing,
    // or ask the user first. For now, we will just log it.
  }

  // --- END OF THE LOGIC ---

  // For extra debugging, you can always log the full info object.
  console.log('Full update info object:', info)
})
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Auto update
  autoUpdater.checkForUpdatesAndNotify({
    title: 'تحديث جديد متوفر',
    body: 'تم تنزيل التحديث وجاهز للتثبيت اغلق البرنامج لتثبيت التحديث ولا تبداه فورا'
  })
  // autoUpdater.checkForUpdates()
  if (require('electron-squirrel-startup')) app.quit()
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

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update-available')
})

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update-downloaded')
})

autoUpdater.on('download-progress', (progressObj) => {
  mainWindow.webContents.send('download-progress', progressObj.percent)
})
autoUpdater.on('error', (error) => {
  console.log(error)
})

ipcMain.on('restart-app', () => {
  autoUpdater.quitAndInstall()
})
