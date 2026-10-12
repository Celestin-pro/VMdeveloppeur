const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('vmdeveloppeur', {
  version: '0.1.0'
});
