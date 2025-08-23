import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)
  } catch (error) {
    console.error('Error in preload script:', error)
    // Since Sentry is not available in preload context, we'll send the error to main process
    // which can then report it to Sentry
    try {
      const errorInfo = error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : {
        message: String(error),
        stack: undefined,
        name: 'UnknownError'
      }
      
      ipcRenderer.send('preload-error', errorInfo)
    } catch (ipcError) {
      // If IPC also fails, just log it
      console.error('Failed to send preload error to main process:', ipcError)
    }
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
