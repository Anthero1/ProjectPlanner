const { dialog, app, BrowserWindow, ipcMain, session } = require('electron');
const path = require("path");
var fs = require('fs');
const fsp = require('fs').promises;

let saveLoc = "C:\\Temporary\\temp.json";
let saveData = null;


const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
    },
  })
  win.loadFile('src/pages/Mission.html');
  win.maximize();

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
      buttons: ['Cancel', 'Leave'],
      icon: "r.jpg",
      message: 'Leave Criteria Screen?',
      detail: 'Changes that you made will not be saved.',
      noLink: true,
    };
    return dialog.showMessageBoxSync(win, options);
  })
}


const CSVToArray = (data, delimiter = '\t', omitFirstRow = false) =>
  data
    .slice(omitFirstRow ? data.indexOf('\n') + 1 : 0)
    .split('\n')
    .map(v => v.split(delimiter));



ipcMain.handle("csvImport", async(event, content) => {
  let csvImport = await fsp.readFile(content, "utf-8");
  let testing = CSVToArray(csvImport)
  console.log(testing);
  return(testing);
})

ipcMain.handle("retrieveData", async () => {
  saveData = await fsp.readFile(saveLoc, "utf-8");
  return saveData;
})

ipcMain.on("saveData", (event, content) => {

  fs.readFile(saveLoc, "utf-8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file: "+err);
      return;
    }
    try {
      const fileToSave = JSON.parse(jsonString);
      fileToSave.MissionStatement=content[0];
      fileToSave.Criteria=content[1];
      fileToSave.Comparisons=content[2];
      fileToSave.Tasks=content[3];
      fileToSave.Budget=content[4];
      saveJSON(fileToSave);
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
        buttons: ['Cancel', 'Leave'],
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