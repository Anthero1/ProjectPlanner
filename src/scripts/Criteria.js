document.getElementById("addCrit").addEventListener("click", (event) => {
    ipc.newCrit();
  }
)

//updates the crit list whenever a new crit is added or a crit is removed
const loadCritList = () => {
  //remove the previous list elements
  currentList=document.getElementsByClassName("criteria");
  var length = currentList.length;
  for(var i = 0; i < length; i++){
    const removeCrit = currentList.item(0);
    removeCrit.remove();
  }

  //add the current list to the page
  let critListDiv = document.getElementById("critList");
  let critList = JSON.parse(sessionStorage.getItem("critList"));
  for(var i = 0; i<critList.length;i++){
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
}

//Makes the delete and save buttons of a criteria work
document.getElementById("critList").addEventListener("click", (event) => {
  const isDelete = event.target.className === "criteriaDelete";
  if(isDelete){
    let currentCritNum=event.target.getAttribute("data-crit-num")
    critList = JSON.parse(sessionStorage.getItem("critList"));
    critList.splice(currentCritNum, 1);
    sessionStorage.setItem("critList", JSON.stringify(critList));
    let currentCrit = document.querySelector((".criteria[data-crit-num='"+currentCritNum+"']"));
    currentCrit.remove();
    for(let i = currentCritNum; i< document.getElementsByClassName("criteria").length; i++){
      let temp = document.getElementsByClassName("criteria").item(i).getAttribute("data-crit-num");
      document.getElementsByClassName("criteria").item(i).querySelectorAll("[data-crit-num='"+temp+"']").forEach((elm) => {
        elm.setAttribute("data-crit-num", temp-1);
      })
      document.getElementsByClassName("criteria").item(i).setAttribute("data-crit-num", temp-1);
    }
    let compList = JSON.parse(sessionStorage.getItem("compList"));
    var loops = 0;
    for(var i = 0; i < critList.length; i++){
      for(var x = i; x < critList.length; x++){
        if(i == currentCritNum || x == currentCritNum){
          compList.splice(loops, 1);
        }
        loops++;
      }
    }
    sessionStorage.setItem("compList", JSON.stringify(compList));
  }

  const isSave = event.target.className ==="saveButton";
  if(isSave){
    let critList = JSON.parse(sessionStorage.getItem("critList"));
    let currentCritNum = event.target.getAttribute("data-crit-num");
    let currentCrit = document.querySelector(("textarea[data-crit-num='"+currentCritNum+"']"));
    let details = document.querySelector(("div.details[data-crit-num='"+currentCritNum+"']")).getElementsByTagName("textarea");
    critList[currentCritNum] = [currentCrit.value, critList[currentCritNum][1], details.item(0).value, details.item(1).value, details.item(2).value, details.item(3).value];
    sessionStorage.setItem("critList", JSON.stringify(critList));
    document.querySelector((".saveButton[data-crit-num='"+currentCritNum+"']")).remove();

    let compList = JSON.parse(sessionStorage.getItem("compList"));
    var loops = 0;
    for(var i = 0; i < critList.length; i++){
      for(var x = i+1; x < critList.length; x++){
        if(i == currentCritNum || x == currentCritNum){
          compList[loops] = -1;
        }
        loops++;
      }
    }
    sessionStorage.setItem("compList", JSON.stringify(compList));
  }
})

//limits titles to 20 characters
document.getElementById("critList").addEventListener("keydown", function(event) {
    if (event.target.className === "critName") {
      if((event.target.value.length) > 19){
        event.preventDefault();
      }else{
        let saveNotExists = document.querySelector((".saveButton[data-crit-num='"+event.target.getAttribute("data-crit-num")+"']")) === null;
        if(saveNotExists){
          event.target.insertAdjacentHTML('afterend', ('<button class="saveButton" data-crit-num="'+event.target.getAttribute("data-crit-num")+'">Save</button>'));
        }
      }
    }else if(event.target.tagName = "textarea"){
      let saveNotExists = document.querySelector((".saveButton[data-crit-num='"+event.target.parentNode.getAttribute("data-crit-num")+"']")) === null;
      if(saveNotExists){
        console.log("Hi");
        event.target.parentNode.parentNode.childNodes.item(0).insertAdjacentHTML('beforebegin', ('<button class="saveButton" data-crit-num="'+event.target.parentNode.getAttribute("data-crit-num")+'">Save</button>'));
      }
    }
  }
)

//makes navbar warn you before leaving with unsaved changes
document.getElementsByClassName("navbar").item(0).addEventListener("click", async (event) => {
  if(event.target.tagName = "a"){
    let saveExists = document.querySelector((".saveButton")) !== null;
    if(saveExists){
      event.preventDefault();
      let response = 0
      response = await ipc.leaveCrit();
      console.log(response)
      if(response===0){
        event.preventDefault();
      }else{
        window.location.href = event.target.href;
      }
    }
  }
})

document.getElementById("critList").addEventListener("click", (event) => {
  if(event.target.className === "critDropdown"){
    let dropdown = document.querySelector(".details[data-crit-num='"+event.target.getAttribute("data-crit-num")+"']")
    if(dropdown.getAttribute("data-open")=="false"){
      dropdown.setAttribute("data-open", "true");
    }else{
      dropdown.setAttribute("data-open", "false");
    }
  }
})

var testing = [["test1",-1,0,0,0,0],["test2",-1,0,0,0,0],["test3",-1,0,0,0,0],["test4",-1,0,0,0,0]];
//sessionStorage.setItem("critList", JSON.stringify(testing));

loadCritList()


