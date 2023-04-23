const loadTasks = () => {
    taskList = JSON.parse(sessionStorage.getItem("taskList"));
    let length=0;
    if(taskList!=null){
        length=taskList.length;
    }
    for(let x = 0; x < length; x++){
        document.getElementById("addTask").insertAdjacentHTML("beforebegin", '<div class="Task" data-task="'+x+'">'+taskList[x][0]+'</div>');
    }
}


const createFields = () => {
    let details = document.getElementById("DetailsDisplay");
    details.insertAdjacentHTML("afterbegin", '<h1>Title:</h1><textarea></textarea><h1>Description:</h1><textarea></textarea><h1>Budget: (only input numbers)</h1><textarea></textarea>');
    details.insertAdjacentHTML("beforeend", '<h1>Applicable Criteria:</h1><ul id="applCrit"></ul>');
    let length = 0;
    if(critList!=null){
        length = critList.length
    }
    for(let i = 0; i < length; i++){
        document.getElementById("applCrit").insertAdjacentHTML('beforeend', '<li data-crit-num="'+i+'"><input type="checkbox" data-crit-num="'+i+'" class="critCheck"/>'+critList[i][0]+'</li>')
    }
}


const loadContent = (x) => {
    if(document.getElementById("DetailsDisplay").childNodes.length==0){
        createFields();
    }
    let details = null;
    let cont = true;
    while(cont){
        details = document.getElementById("DetailsDisplay").childNodes;
        for(let i = 0; i < 3; i++){
            details[i*2+1].value=taskList[x][i];
            cont = false;
        }
        let checkBoxes=document.getElementsByClassName("critCheck");
        if(taskList[x][3].length==checkBoxes.length){
            for(let z = 0; z < taskList[x][3].length;z++){
                checkBoxes.item(z).checked = taskList[x][3][z];
            }
        }else{
            console.log(checkBoxes.length);
            for(let z = 0; z < checkBoxes.length;z++){
                checkBoxes.item(z).checked = false;
            }
        }
    }
}

//load task info on task click
document.getElementById("TaskList").addEventListener("click", (event) => {
    if((event.target.className == "Task")){
        let list = document.getElementById("TaskList").getElementsByClassName("Task");
        for(let i = 0; i < list.length; i++){
            if(list.item(i).getAttribute("data-active")==="true"){
                list.item(i).setAttribute("data-active", "false");
            }
        }
        event.target.setAttribute("data-active", true);
        loadContent(event.target.getAttribute("data-task"));
    }
})


//makes the addTask button function
document.getElementById("addTask").addEventListener("click", (event) => {
    let length=0;
    if(taskList==null){
        taskList = [];
    }else{
        length=taskList.length;
    }
    taskList.push(["TaskTitle","Description","100",[]]);
    event.target.insertAdjacentHTML("beforebegin", '<div class="Task" data-task="'+length+'">TaskTitle</div>')
    sessionStorage.setItem('taskList', JSON.stringify(taskList));
})


//makes a save button when editing the fields onscreen (if one doesn't already exists)
document.getElementById("DetailsDisplay").addEventListener("keypress", (event) => {
    let saveExists = document.querySelector((".saveBtn")) !== null;
    if(event.target.tagName=="TEXTAREA" && !saveExists){
        document.getElementById("DetailsDisplay").insertAdjacentHTML("afterbegin", '<button class="saveBtn">Save</button>');
    }
})


//makes deleting characters create a savebutton (if one doesnt already exist)
document.getElementById("DetailsDisplay").addEventListener("keydown", (event) => {
    if(event.key == "Backspace" && event.target.value!=""){
        let saveExists = document.querySelector((".saveBtn")) !== null;
        if(event.target.tagName=="TEXTAREA" && !saveExists){
            document.getElementById("DetailsDisplay").insertAdjacentHTML("afterbegin", '<button class="saveBtn">Save</button>');
        }
    }
})


//makes the save button work
document.getElementById("DetailsDisplay").addEventListener("click", (event) => {
    if(event.target.className == "saveBtn"){
        let details = document.getElementById("DetailsDisplay").childNodes;
        taskNum = document.querySelector(".Task[data-active='true']").getAttribute("data-task");
        taskList[taskNum][0]=details[2].value;
        taskList[taskNum][1]=details[4].value;
        taskList[taskNum][2]=details[6].value;

        let critChoices = [];
        checkBoxes=document.getElementsByClassName("critCheck");
        for(let i = 0; i < checkBoxes.length; i++){
            critChoices.push(checkBoxes.item(i).checked);
        }
        taskList[taskNum][3]=critChoices;
        
        document.querySelector((".saveBtn")).remove();
        sessionStorage.setItem('taskList', JSON.stringify(taskList));
        console.log(taskList)
        document.querySelector(".Task[data-active='true']").innerHTML = details[1].value;
    }
})

// //Makes the title autoupdate in the taskList if its edited in the details section
// document.getElementById("DetailsDisplay").addEventListener("keypress", (event) => {
//     let titleField = document.getElementById("DetailsDisplay").childNodes[2]
//     if(event.target == titleField){
//         document.querySelector(".Task[data-active='true']").innerHTML = event.target.value;
//     }
// })
// document.getElementById("DetailsDisplay").addEventListener("keydown", (event) => {
//     if(event.key == "Backspace"){
//         let titleField = document.getElementById("DetailsDisplay").childNodes[2];
//         if(event.target == titleField){
//             document.querySelector(".Task[data-active='true']").innerHTML = event.target.value;
//         }
//     }
// })

// document.getElementById("TaskList").addEventListener("mouseover", (event) =>{
//     (document.getElementById("TaskList").style.overflowY) = "scroll";
// })

// document.getElementById("DetailsDisplay").addEventListener("mouseover", (event) =>{
//     (document.getElementById("TaskList").style.overflowY) = "hidden";
// })

var taskList = JSON.parse(sessionStorage.getItem("taskList"));
var critList=JSON.parse(sessionStorage.getItem("critList"));

loadTasks();