const loadTasks = () => {
    for(x in taskList){
        event.target.insertAdjacentHTML("beforebegin", '<div class="Task">'+x[0]+'</div>');
    }
}


const createFields = () => {
    let details = document.getElementById("DetailsDisplay");
    details.insertAdjacentHTML("afterbegin", '<h1>Title:</h1><textarea></textarea><h1>Description:</h1><textarea></textarea><h1>Budget: (only input numbers)</h1><textarea></textarea>')
}


const loadContent = (x) => {
    if(document.getElementById("DetailsDisplay").childNodes.length==0){
        createFields();
    }
    let details = document.getElementById("DetailsDisplay").childNodes;
    for(let i = 0; i < 3; i++){
        console.log(details[i*2-1]);
        details[i*2+1].value=taskList[x][i];
    }
}


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

// document.getElementById("TaskList").addEventListener("mouseover", (event) =>{
//     (document.getElementById("TaskList").style.overflowY) = "scroll";
// })

// document.getElementById("DetailsDisplay").addEventListener("mouseover", (event) =>{
//     (document.getElementById("TaskList").style.overflowY) = "hidden";
//     console.log("happened")
// })

document.getElementById("addTask").addEventListener("click", (event) => {
    event.target.insertAdjacentHTML("beforebegin", '<div class="Task" data-task="'+taskList.length+'"></div>')
    taskList.push(["yellow","orange","green"]);
})

document.getElementById("DetailsDisplay").addEventListener("keypress", (event) => {
    let saveExists = document.querySelector((".saveBtn")) !== null;
    if(event.target.tagName=="TEXTAREA" && !saveExists){
        document.getElementById("DetailsDisplay").insertAdjacentHTML("afterbegin", '<button class="saveBtn">Save</button>');
    }
})

document.getElementById("DetailsDisplay").addEventListener("click", (event) => {
    if(event.target.className == "saveBtn"){
        let details = document.getElementById("DetailsDisplay").childNodes;
        taskNum = document.querySelector(".Task[data-active='true']").getAttribute("data-task");
        taskList[taskNum][0]=details[2].value;
        taskList[taskNum][1]=details[4].value;
        taskList[taskNum][2]=details[6].value;
        document.querySelector((".saveBtn")).remove();
    }
})



var taskList = JSON.parse(sessionStorage.getItem("taskList"));
if(taskList==null){
    taskList = [];
}

loadTasks();