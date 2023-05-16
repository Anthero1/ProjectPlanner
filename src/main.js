const { dialog, app, BrowserWindow, ipcMain, session } = require('electron');
const path = require("path");
var fs = require('fs');
const fsp = require('fs').promises;


//the location where the project is saved in Json format
let saveLoc = "C:\\Temporary\\temp.json";

//saves the taskimport in the main process for;
let taskImport = "";


//creates the main window of the app
const createWindow = () => {
  //creates the window with the correct preload script (allows the window to communicate with the main process)
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
    },
  })

  //loads the correct html page and maximizes the window
  win.loadFile('src/pages/Mission.html');
  win.maximize();

  //when a criteria is saved in the new criteria window, send the info over to the main window
  ipcMain.on("saveCrit", (event, content) => {
    win.webContents.send("newCrit", content);
    console.log(content);
  })
  
  //when the imported tasks in a taskImport window is saved, send the info to the main window
  ipcMain.on("saveImport", (event, content) => {
    win.webContents.send("saveImport", content);
    console.log(content);
  })

  //if the user decides not to make a new crit, notify the main window not to add a new criteria
  ipcMain.on("DiscardCrit", () => {
    win.webContents.send("newCrit", -1);
  })

  //if the user ever tries to leave a page with unsaved changes, ask them to confirm first and send the response back to the window they tried to leave.
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

//processes csv data into array format (only tested with excel csv export)
const CSVToArray = (data, delimiter = ',', omitFirstRow = false) => {

  //declares all necessary variables
  let ansArray=[];
  let tempArray=[];
  let tempString = "";
  let lastLoc=0;
  let add=false;

  for(let i = 0; i < data.length;i++){//iterate over every character in the csv
    if(data[i]=='"'){//if the character is the start of a quote, then set the entire quote as one entry in the array. Ignore commas, new lines, and other special characters inside the quote
      let j = i+1;
      do{//iterate until the end of the quote is found
        if(data[j]=='"'&&data[j+1]=='"'){
          tempString=tempString+'"';
          j=j+2;
        }else{
          tempString=tempString+data[j];
          j++;
        }
      }while((data[j]!='"'&&j<data.length)||(data[j+1]=='"'&&data[j]=='"'));
      tempArray.push(tempString);//push this quote to the array
      tempString = "";

      if(data[j+1]==","){
        //update the i and last loc values after the quote if the there is another entry on this line of the csv (if next char is a comma, there is another entry)
        i=j+1;
        lastLoc=j+2;
      }else if(data.substring(j+1, j+3)=="\r\n"){
        //if the following characters are the ending of a line, check to make sure that all of the entries weren't empty
        for(let x in tempArray){
          if(x!=""){
            add=true;
          }
        }
        //if there was at least one non-empty entry, add this row to the array
        if(add){
          ansArray.push(tempArray);
          tempArray=[];
        }

        //update the j and lastloc values for the next loop
        add=false;
        i=j+2;
        lastLoc=j+3;
      }
    } 
    else if(data[i]==delimiter){// if the current character is equal to the delimeter (comma by default) then push the currently stored string into the array and update the last loc variable
      tempArray.push(tempString);
      tempString="";
      lastLoc=i+1;
    }
    else if(data.substring(i,i+2)=="\r\n"){//if the parser has run into a line end, handle the situation
      //push the current string onto the temp array and update the last loc and i variable
      tempArray.push(tempString);
      tempString="";
      lastLoc=i+2;
      i++;

      //run a check, and if the tmeparray isn't completely empty add it to the main array
      for(let z = 0; z<tempArray.length;z++){
        if(tempArray[z]!=""){
          add=true;
        }
      }
      if(add){
        ansArray.push(tempArray);
        tempArray=[];
      }
      add=false;
    }else{ // if the currently selected character is just normal, then puh it to the current entry string
      tempString = tempString+data[i];
    }
  }
  return ansArray;
}


//handle the csvImport message from a window
ipcMain.handle("csvImport", async(event) => {
  //prompt the user to choose a file to upload
  await dialog.showOpenDialog({properties: ['openFile'] }).then(async function (response) {
    if (!response.canceled) {
        taskImport = response.filePaths[0]
    } else {
      console.log("no file selected");
    }
  });
  //if the user chose a file, read it and process it with csvtoarray, then return it back to the window that sent the csvImport message
  if(taskImport!=null){
    let csvImport = await fsp.readFile(taskImport, "utf-8");
    let testing = CSVToArray(csvImport)
    taskImport=null;
    return (testing);
  }else{
    return (null);
  }
})

//retrieves save data from the "save location" and returns it to the window that asked for it
ipcMain.handle("retrieveData", async () => {
  let saveData = await fsp.readFile(saveLoc, "utf-8");
  return saveData;
})

//handles the situation when a user wants to save their current workspace info
ipcMain.on("saveData", (event, content) => {
  //write the content sent by the window into the savelocation JSON file
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

//when the user decides to make a new criteria, handle the situation
ipcMain.on("newCrit", (event) => {
  var discard=false;

//open a new criteria making window
  var critInput = new BrowserWindow({
    webPreferences: {
        preload: path.join(__dirname, 'newCritPreload.js'),
    },
  })
  critInput.maximize();
  critInput.loadFile('src/pages/NewCrit.html')


  //if the user tries to close the criteria, and they haven't pressed save on the page, prompt them to make sure they actually want to leave, in which case close the window, otherwise prevent the window from closing
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
  //if the user has pressed the buton to save the page, let the window close.
  ipcMain.on("saveCrit", (event, content) => {
    discard = true;
  })
})




//if the user decides to import a task list, handle the situation
ipcMain.on("taskImport", (event) => {
  var discard=false;

//open a new task import window 
  var taskImport = new BrowserWindow({
    // width: 800,
    // height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'taskImportPreload.js'),
    },
  })
  taskImport.maximize();
  taskImport.loadFile('src/pages/TaskImport.html')


  //if the user tries to close the criteria, and they haven't pressed save on the page, prompt them to make sure they actually want to leave, in which case close the window, otherwise prevent the window from closing
  taskImport.on("close", (event) => {
    if(!discard){
      const options = {
        type: 'warning',
        buttons: ['Cancel', 'Leave'],
        message: 'Close Window?',
        detail: 'Import that you made will not be saved.',
        noLink: true,
      };
      const response = dialog.showMessageBoxSync(critInput, options)
      if(response==0){
        event.preventDefault();
      }
    }
  })
  //if the user has pressed the buton to save the page, let the window close.
  ipcMain.on("saveImport", (event, content) => {
    discard = true;
  })
})


//save an array into a Json file
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

//do these things when the app is ready
app.whenReady().then(() => {
  //create the main window
  createWindow()

  //if you click on the app icon with no windows currently open, make a new main window
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


//if the user closes all of the windows, and they aren't using a mac, shut off the app.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})