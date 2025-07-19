import { app, BrowserWindow, dialog } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

// Configure logging
log.transports.file.level = 'info'
autoUpdater.logger = log

export function setupAutoUpdater(mainWindow?: BrowserWindow): void {
  // Check for updates when app is ready
  const env = import.meta.env.VITE_REACT_APP_ENV
  const isProd = env === 'production'
  console.log('Environment:', env, 'Is Production:', isProd)

  if (!isProd) {
    log.info('Auto updates disabled in non-production environment:', env)
    return
  }

  log.info('Checking for updates in production environment')

  if (require('electron-squirrel-startup')) app.quit()

  // Only register events and check for updates if we're in production
  autoUpdater.on('update-available', () => {
    if (mainWindow) {
      mainWindow.webContents.send('update-available')
    }
    log.info('Update available')
  })

  autoUpdater.on('update-downloaded', (info) => {
    if (mainWindow) {
      mainWindow.webContents.send('update-downloaded')
    }

    log.info('Update downloaded', info.version)

    dialog
      .showMessageBox({
        type: 'info',
        title: 'تحديث جديد متوفر',
        message: `تم تنزيل التحديث وجاهز للتثبيت اغلق البرنامج لتثبيت التحديث ولا تبداه فورا`,
        buttons: ['تثبيت الآن', 'لاحقاً']
      })
      .then((returnValue) => {
        if (returnValue.response === 0) {
          autoUpdater.quitAndInstall(false, true)
        }
      })
  })

  autoUpdater.on('download-progress', (progressObj) => {
    if (mainWindow) {
      mainWindow.webContents.send('download-progress', progressObj.percent)
    }
    log.info(`Download progress: ${progressObj.percent}%`)
  })

  autoUpdater.on('update-not-available', () => {
    if (mainWindow) {
      mainWindow.webContents.send('update-not-available')
    }
    log.info('No updates available')
  })

  // Error handling
  autoUpdater.on('error', (error) => {
    log.error('Auto updater error:', error)
    if (mainWindow) {
      mainWindow.webContents.send('update-error', error.message)
    }
  })

  // Check for updates
  autoUpdater.checkForUpdatesAndNotify({
    title: 'تحديث جديد متوفر',
    body: 'تم تنزيل التحديث وجاهز للتثبيت اغلق البرنامج لتثبيت التحديث ولا تبداه فورا'
  })
}
