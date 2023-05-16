const { contextBridge, ipcRenderer, dialog} = require('electron');

//expose communication cuntions to the renderer process scripts, so that they can communicate with the main process
contextBridge.exposeInMainWorld("ipc", {
  newCrit: () => ipcRenderer.send("newCrit"),
  taskImport: () => ipcRenderer.send("taskImport"),
  leaveCrit: () => ipcRenderer.invoke("leaveCrit"),
  saveAllData: () => saveData(),
  retrieveData: () => ipcRenderer.invoke("retrieveData"),
  csvImport: () => ipcRenderer.invoke("csvImport")
})

//retrieve the current session data from session storage, and send it to the main process to be saved
const saveData = () => {
  var content = [];
  let mission = sessionStorage.getItem("MissionStatement");
  let criteria = JSON.parse(sessionStorage.getItem("critList"));
  let comparisons = JSON.parse(sessionStorage.getItem("compList"));
  let tasks = JSON.parse(sessionStorage.getItem("taskList"));
  let budget = sessionStorage.getItem("budget");
  content.push(mission);
  content.push(criteria);
  content.push(comparisons);
  content.push(tasks);
  content.push(budget);
  ipcRenderer.send("saveData", content);
}

//change the title of the main window to Projee
document.addEventListener('DOMContentLoaded', function () {
  document.getElementsByTagName("title").item(0).innerHTML="Projee";
})


//when the main process returns a newly created crit, add it to the session storage and update the current page to include this
ipcRenderer.on("newCrit", (event, content) => {
  critList = JSON.parse(sessionStorage.getItem("critList"));
  newCrit= content;
  if(newCrit!=-1){
    if(critList==null){
      critList=[newCrit]
    }else{
      critList.push(newCrit);
    }
    sessionStorage.setItem("critList", JSON.stringify(critList));

    compList= JSON.parse(sessionStorage.getItem("compList"));
    if(critList.length==2){
      compList=[-1];
    }else if(critList.length>2){
      var pos=compList.length-1;
      for(var i = 1; i < critList.length; i++){
        compList.splice(pos,0,-1)
        pos+=critList.length-i
      }
    }
    sessionStorage.setItem("compList", JSON.stringify(compList));
    
    let critListDiv = document.getElementById("critList");
    i=critList.length-1;
    critListDiv.insertAdjacentHTML('beforeend', ('<div class="criteria" data-crit-num="'+i+'"><textarea class="critName" data-crit-num="'+i+'">'+critList[i][0]+'</textarea><button class="criteriaDelete" data-crit-num="'+i+'"></button><button class="critDropdown" data-crit-num="'+i+'"></button><div class="details" data-crit-num="'+i+'" data-open="false"></div></div>'));
    let description = critListDiv.getElementsByClassName("criteria").item(i).getElementsByClassName("details").item(0); 
    description.insertAdjacentHTML("beforeend",'<p>Description</p>');
    description.insertAdjacentHTML("beforeend", '<textarea class="Description">'+critList[i][2]+'</textarea>')
    description.insertAdjacentHTML("beforeend", "<p>How does this criteria lead to this project succeeding? (if we don't accomplish this criteria, what happens?)</p>");
    description.insertAdjacentHTML("beforeend", '<textarea class="leadToSuccess">'+critList[i][3]+'</textarea>')
    description.insertAdjacentHTML("beforeend", '<p>How will you measure this criteria?</p>');
    description.insertAdjacentHTML("beforeend", '<textarea class="Measure">'+critList[i][4]+'</textarea>')
    description.insertAdjacentHTML("beforeend",'<p>How does this criteria tie into the mission statement?</p>');
    description.insertAdjacentHTML("beforeend", '<textarea class="Mission">'+critList[i][5]+'</textarea>')
  }
})


//
ipcRenderer.on("saveImport", (event, content) => {
  sessionStorage.setItem("csvImport", JSON.stringify(content));
  let taskList = JSON.parse(sessionStorage.getItem("taskList"));
  let csvTasks = [];
  let temp = [];
  for(let i = 1; i < content.length;i++){
    for(let x = 0; x <content[i].length;x++){
      temp.push([content[0][x],content[i][x]])
    }
    csvTasks.push(temp);
    temp = [];
  }

  if(taskList==null){
    taskList= csvTasks;
  }else{
    taskList = taskList.concat(csvTasks);
  }
  sessionStorage.setItem("taskList", JSON.stringify(taskList));


  let currDisplayed = document.getElementsByClassName("Task");
  for(let i = 0; i <currDisplayed.length; i++){
    currDisplayed.item(i).remove();
  }

  let length=0;
  if(taskList!=null){
      length=taskList.length;
  }
  for(let x = 0; x < length; x++){
      document.getElementById("addTask").insertAdjacentHTML("beforebegin", '<div class="Task" data-task="'+x+'">'+taskList[x][0][1]+'</div>');
  }
})