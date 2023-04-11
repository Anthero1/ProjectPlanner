const { dialog, contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("ipc", {
  discard: () => ipcRenderer.send("DiscardCrit"),
  saveCrit: (content) => ipcRenderer.send("saveCrit", content)
})

document.addEventListener('DOMContentLoaded', function () {
  document.getElementsByTagName("title").item(0).innerHTML="PM Scheduler";
})
