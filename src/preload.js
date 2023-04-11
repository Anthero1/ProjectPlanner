const { contextBridge, ipcRenderer, dialog} = require('electron');

contextBridge.exposeInMainWorld("ipc", {
  saveThis: (identifier, content) => ipcRenderer.send(identifier, content),
  newCrit: () => ipcRenderer.send("newCrit"),
  leaveCrit: () => ipcRenderer.invoke("leaveCrit")
})

document.addEventListener('DOMContentLoaded', function () {
  document.getElementsByTagName("title").item(0).innerHTML="PM Scheduler";
})

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
  }
})