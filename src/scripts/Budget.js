
//calcultes the criteria ranks based of the user's choices
//the calculations are based of common multi criteria decision making calculations
const calculateCritRanks = () => {
    let criteria = JSON.parse(sessionStorage.getItem("critList"));
    let comparisons = JSON.parse(sessionStorage.getItem("compList"));
    let numOfCrits = criteria.length;
    let weightMatrix = [];
    let normMatrix = [];

    //sets up the matrices for the choices and the normalized choices
    for(let iter = 0; iter < numOfCrits; iter++){
        weightMatrix.push([0,0,0,0]);
        weightMatrix[iter][iter]=1;
        normMatrix.push([0,0,0,0]);
        normMatrix[iter][iter]=1;
    }

    //calculates the entries for the weight matric based on the users comparison choices. does the same for the norm matrix, which will be worked with further down.
    let tracker = 0;
    for(let i = 0; i < numOfCrits; i++){
        for(let x = i+1; x < numOfCrits; x++){
            if(comparisons[tracker]>0){
                weightMatrix[x][i]=comparisons[tracker];
                weightMatrix[i][x]=1/comparisons[tracker];
                normMatrix[x][i]=comparisons[tracker];
                normMatrix[i][x]=1/comparisons[tracker];
            }else{
                weightMatrix[x][i]=1/(-comparisons[tracker]);
                weightMatrix[i][x]=-comparisons[tracker];
                normMatrix[x][i]=1/-comparisons[tracker];
                normMatrix[i][x]=-comparisons[tracker];
            }
            tracker++;
        }
    }
    
    let normCoeffs = [];
    let tot = 0;
    //calculates the normalization coefficients of the collumns
    for(let i = 0; i < numOfCrits; i++){
        tot = 0;
        for(x = 0; x < numOfCrits; x++){
            tot+=weightMatrix[x][i]
        }
        normCoeffs.push(tot);
    }

    //normalisez the normMatrix, then uses the normMatrix values to calculate the priority vector (each entry in the vector is a weight of how important that criteria is)
    priorityVector = [];
    for(let i = 0; i < numOfCrits; i++){
         tot = 0;
        for(let x = 0; x < numOfCrits; x++){
            normMatrix[i][x]=normMatrix[i][x]/normCoeffs[x];
            tot+=normMatrix[i][x];
        }
        tot=tot/numOfCrits;
        priorityVector.push(tot);
    }

    //stores the priority vector in storage
    sessionStorage.setItem("critRanks", JSON.stringify(priorityVector));
}


//function for sorting the tasks based on priority vector
function compares(a, b) {
    if (a<b) {
      return 1;
    }
    if (a>b) {
      return -1;
    }
    return 0;
}


//based on the users choices of which criteria apply to each task and on the priority vector, calculates the importance of each task to rank them
const calculateTaskRanks = () => {
    let tasks = JSON.parse(sessionStorage.getItem("taskList"));
    tasksRanked = [];
    for(let i = 0; i < tasks.length; i++){
        let temp = 0;
        for(let x = 0; x<priorityVector.length;x++){
            //if the criteria applies to this task, add the criteria's priority vector value to the total task priority value.
            if(tasks[i][3][x]==true){
                temp+=priorityVector[x];
            }
        }
        tasksRanked.push([temp,tasks[i]]);
    }

    //sort the tasks based on the value calculated above
    tasksRanked.sort(compares);
}


//loads the tasks and highlights the tasks that don't fit in the budget in red
const loadRanks = () => {
    //retrieves the tasks
    if(sessionStorage.getItem("critRanks")==null){calculateCritRanks()
    }else{
       priorityVector=JSON.parse(sessionStorage.getItem("critRanks"));
    }
    if(sessionStorage.getItem("taskRanks")==null){calculateTaskRanks()}

    let rankList = document.getElementById("taskList");
    let budget=sessionStorage.getItem("budget");

    //if the budget has't been set by the user, let them know and set the budget to the max int value
    if(budget==null){
        budget=Number.MAX_VALUE;
        alert("Please enter and submit a budget on the Mission screen");
    }

    //loads the tasks and highlights the out-of-budget ones in red
    let currentBudget=0;
    for(let i = 0; i < tasksRanked.length; i++){
        try{
            currentBudget+=Number(tasksRanked[i][1][2]);
        }catch(e){
            alert("Please enter a budget on the following task: "+tasksRanked[i][1][0]);
            return 0;
        }

        console.log(currentBudget);
        if(currentBudget<=budget){
            rankList.insertAdjacentHTML("beforeend", '<div class="task" data-in-budget="true">'+tasksRanked[i][1][0]+'</div>')
        }else {
            rankList.insertAdjacentHTML("beforeend", '<div class="task" data-in-budget="false">'+tasksRanked[i][1][0]+'</div>')
        }
    }
}

var tasksRanked = [];
var priorityVector = [];
loadRanks();