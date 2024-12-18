const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    startInsertion: (args) => ipcRenderer.send('start-insertion', args),
    onStatusUpdate: (callback) => ipcRenderer.on('status-update', (_, type, message) => callback(type, message)),
  });