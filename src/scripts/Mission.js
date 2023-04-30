document.getElementById("missionBox").addEventListener("keyup", () => {
  //saving.saveThis("saveData", document.getElementById("missionBox").value.toString());
  sessionStorage.setItem("MissionStatement", document.getElementById("missionBox").value.toString());
})

document.getElementById("budgetBox").addEventListener("keyup", () => {
  //saving.saveThis("saveData", document.getElementById("missionBox").value.toString());
  sessionStorage.setItem("budget", document.getElementById("budgetBox").value.toString());
})

document.getElementById("save").addEventListener("click", () => {
  ipc.saveAllData();
})

document.getElementById("csv").addEventListener("click", async () => {
  let csvImport = await ipc.csvImport();
  console.log(csvImport);

  sessionStorage.setItem("csvImport", JSON.stringify(csvImport));
})

document.getElementById("load").addEventListener("click", async () => {
  let data = await ipc.retrieveData();
  console.log(data);
  console.log(JSON.parse(data))
  sessionStorage.setItem("MissionStatement", JSON.parse(data).MissionStatement);
  sessionStorage.setItem("critList", JSON.stringify(JSON.parse(data).Criteria));
  sessionStorage.setItem("compList", JSON.stringify(JSON.parse(data).Comparisons));
  sessionStorage.setItem("taskList", JSON.stringify(JSON.parse(data).Tasks));
  sessionStorage.setItem("budget", JSON.parse(data).Budget);
})

try{
  document.getElementById("missionBox").value = sessionStorage.getItem("MissionStatement");
}catch(err){
  console.log(err);
}