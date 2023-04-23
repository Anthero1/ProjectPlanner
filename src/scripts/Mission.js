document.getElementById("missionBox").addEventListener("keyup", () => {
  //saving.saveThis("saveData", document.getElementById("missionBox").value.toString());
  sessionStorage.setItem("MissionStatement", document.getElementById("missionBox").value.toString());
})

document.getElementById("budgetBox").addEventListener("keyup", () => {
  //saving.saveThis("saveData", document.getElementById("missionBox").value.toString());
  sessionStorage.setItem("budget", document.getElementById("budgetBox").value.toString());
})

document.getElementById("missionSubmit").addEventListener("click", () => {
  ipc.saveAllData();
})

document.getElementById("budgetSubmit").addEventListener("click", () => {
  ipc.retrieveData();
})

try{
  document.getElementById("missionBox").value = sessionStorage.getItem("MissionStatement");
}catch(err){
  console.log(err);
}