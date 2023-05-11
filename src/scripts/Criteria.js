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

    //creates and sets all of the criteria description fields
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

  //checks to make sure the button that has been clicked is the delete button
  const isDelete = event.target.className === "criteriaDelete";

  if(isDelete){
    //retrieves the number of the criteria being deleted and splices it out of the criteria list
    let currentCritNum=event.target.getAttribute("data-crit-num")
    critList = JSON.parse(sessionStorage.getItem("critList"));
    critList.splice(currentCritNum, 1);
    sessionStorage.setItem("critList", JSON.stringify(critList));
    
    //removes the criteria from the crit list
    let currentCrit = document.querySelector((".criteria[data-crit-num='"+currentCritNum+"']"));
    currentCrit.remove();

    //de-increments the "crit-number" variable for each criteria element in the html (that came after the deleted crit, e.g. if crit 8 is deleted, crit 9 becomes 8, 10 becomes 9, etc.)
    for(let i = currentCritNum; i< document.getElementsByClassName("criteria").length; i++){
      let temp = document.getElementsByClassName("criteria").item(i).getAttribute("data-crit-num");
      document.getElementsByClassName("criteria").item(i).querySelectorAll("[data-crit-num='"+temp+"']").forEach((elm) => {
        elm.setAttribute("data-crit-num", temp-1);
      })
      document.getElementsByClassName("criteria").item(i).setAttribute("data-crit-num", temp-1);
    }

    //removes the comparisons that involve the deleted criteris from the comparison list
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

  //checks to make sure the button that has been clicked is a save button
  const isSave = event.target.className ==="saveButton";
  if(isSave){
    //selects all the different html elements that will need to be edited
    let critList = JSON.parse(sessionStorage.getItem("critList"));
    let currentCritNum = event.target.getAttribute("data-crit-num");
    let currentCrit = document.querySelector(("textarea[data-crit-num='"+currentCritNum+"']"));
    let details = document.querySelector(("div.details[data-crit-num='"+currentCritNum+"']")).getElementsByTagName("textarea");

    //retrieves and saves the field values from the html page into the session storage criteria list
    critList[currentCritNum] = [currentCrit.value, critList[currentCritNum][1], details.item(0).value, details.item(1).value, details.item(2).value, details.item(3).value];
    sessionStorage.setItem("critList", JSON.stringify(critList));
    document.querySelector((".saveButton[data-crit-num='"+currentCritNum+"']")).remove();

    //resets the comparisons that involved the update criteria
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

//limits titles to 20 characters amd creates a save button whenever a text field is edited
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

//makes the dropdown element of the criteria work
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


