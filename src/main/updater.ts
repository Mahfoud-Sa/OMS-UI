import { app, BrowserWindow } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

// autoUpdater.autoDownload = true
// autoUpdater.forceDevUpdateConfig = true

export function setupAutoUpdater(mainWindow?: BrowserWindow): void {
  // Check for updates when app is ready
  const env = import.meta.env.VITE_REACT_APP_ENV_VALUE
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
