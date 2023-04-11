document.getElementById("missionBox").addEventListener("keyup", () => {
  //saving.saveThis("saveData", document.getElementById("missionBox").value.toString());
  sessionStorage.setItem("MissionStatement", document.getElementById("missionBox").value.toString());
})

try{
  document.getElementById("missionBox").value = sessionStorage.getItem("MissionStatement");
}catch(err){
  console.log(err);
}