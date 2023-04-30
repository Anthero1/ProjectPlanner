const { dialog, contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("ipc", {
  discard: () => ipcRenderer.send("DiscardCrit"),
  csvImport: () => ipcRenderer.invoke("csvImport"),
  saveImport: (content) => ipcRenderer.send("saveImport", content)
})

document.addEventListener('DOMContentLoaded', function () {
  document.getElementsByTagName("title").item(0).innerHTML="Task Import";
})
