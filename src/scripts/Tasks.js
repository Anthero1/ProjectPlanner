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


const createFields = (task) => {
    //get the area where everything will be displayed
    let details = document.getElementById("DetailsDisplay");

    //remove everything that was displayed for the previous task
    while(details.children.length!=0){
        details.children.item(0).remove();
    }

    //add in the criteria ranking choices
    details.insertAdjacentHTML("beforeend", '<h1>Applicable Criteria:</h1><ul id="applCrit"></ul>');
    let length = 0;
    if(critList!=null){
        length = critList.length
    }
    for(let i = 0; i < length; i++){
        document.getElementById("applCrit").insertAdjacentHTML('beforeend', '<li data-crit-num="'+i+'"><input type="checkbox" data-crit-num="'+i+'" class="critCheck"/>'+critList[i][0]+'</li>')
    }

    //add in the description fields.
    for(let i = 0; i < task.length;i++){
        details.insertAdjacentHTML("beforeend", '<h1>'+task[i][0]+':</h1><textarea></textarea>');
    }

    console.log(details.children);
}


//loads the task info of a certain task
const loadContent = (x) => {
    //creates the html fields for this task
    createFields(taskList[x]);

    //fills in the html details for this task
    let details = null;
    details = document.getElementById("DetailsDisplay").children;
    for(let i = 3; i < details.length; i++){
        if(i%2!=0){
            console.log(taskList[x])
            details[i].value=taskList[x][(i-3)/2][1];
        }
    }
    //creates the criteria application choices for each task
    let checkBoxes=document.getElementsByClassName("critCheck");
    if(taskList[x][taskList[x].length-1].length==checkBoxes.length){
        for(let z = 0; z < taskList[x][taskList[x].length-1].length;z++){
            checkBoxes.item(z).checked = taskList[x][taskList[x].length-1][z];
        }
    }else{
        for(let z = 0; z < checkBoxes.length;z++){
            checkBoxes.item(z).checked = false;
        }
    }
}

//load task info on task click
document.getElementById("TaskList").addEventListener("click", (event) => {
    taskList = JSON.parse(sessionStorage.getItem("taskList"));
    if((event.target.className == "Task")){

        //changes the color of the actively selecte task and resets the color of all other tasks
        let list = document.getElementById("TaskList").getElementsByClassName("Task");
        for(let i = 0; i < list.length; i++){
            if(list.item(i).getAttribute("data-active")==="true"){
                list.item(i).setAttribute("data-active", "false");
            }
        }
        //loads the task content
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


//makes the Import Tasks button function
document.getElementById("importTask").addEventListener("click", (event) => {
    ipc.taskImport();
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


var taskList = JSON.parse(sessionStorage.getItem("taskList"));
var critList=JSON.parse(sessionStorage.getItem("critList"));

loadTasks();