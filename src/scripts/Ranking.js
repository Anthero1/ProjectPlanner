
//selector choice submit event listener
document.getElementById("CriteriaSubmit").addEventListener("click", criteriaChoiceSubmit);


function criteriaChoiceSubmit(){
    var e = document.getElementById("CriteriaSelector");
    var choice = e.value;
    
    alert("you chose " + choice);
}