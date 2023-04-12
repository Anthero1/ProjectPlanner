const { dialog, app, BrowserWindow, ipcMain, session } = require('electron');
const path = require("path");
var fs = require('fs');

let saveLoc = "C:\\Temporary\\temp.json";
let discard = false;

const createWindow = () => {

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
    },
  })


  win.loadFile('src/pages/Mission.html')

  ipcMain.on("saveCrit", (event, content) => {
    win.webContents.send("newCrit", content);
    console.log(content);
  })
  ipcMain.on("DiscardCrit", () => {
    win.webContents.send("newCrit", -1);
  })
  ipcMain.handle("leaveCrit", (event) => {
    const options = {
      type: 'warning',
      buttons: ['Leave', 'Cancel'],
      icon: "r.jpg",
      message: 'Leave Criteria Screen?',
      detail: 'Changes that you made will not be saved.',
      noLink: true,
    };
    return dialog.showMessageBoxSync(win, options);
  })
}

ipcMain.on("saveData", (event, content) => {

  fs.readFile(saveLoc, "utf-8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file: "+err);
      return;
    }
    try {
      const saveFile = JSON.parse(jsonString);
      saveFile.MissionStatement=content;
      saveJSON(saveFile);
    } catch (err) {
      console.log(err);
    }
  })

})

ipcMain.on("newCrit", (event) => {
  var discard=false;
  console.log("okay");

  var critInput = new BrowserWindow({
    // width: 800,
    // height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'newCritPreload.js'),
    },
  })
  critInput.maximize();
  critInput.loadFile('src/pages/NewCrit.html')


  critInput.on("close", (event) => {
    if(!discard){
      const options = {
        type: 'warning',
        buttons: ['Leave', 'Cancel'],
        message: 'Close Window?',
        detail: 'Changes that you made will not be saved.',
        noLink: true,
      };
      const response = dialog.showMessageBoxSync(critInput, options)
      if(response==0){
        event.preventDefault();
      }
    }
  })
  ipcMain.on("saveCrit", (event, content) => {
    discard = true;
  })
})


const saveJSON = (jsonObj) => {
  jsonObj = JSON.stringify(jsonObj);
  fs.writeFile(saveLoc, jsonObj, (err) =>{
    if(!err){
      console.log("File Written!");
    }else{
      console.log(err);
    }
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})