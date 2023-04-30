document.getElementById("saveImport").addEventListener("click", () => {
    csvImport = JSON.parse(sessionStorage.getItem("csvImport"));
    let selectors = document.getElementsByClassName("fieldChoice");
    let iter = 0;
    for(let x = selectors.length-1; x>=0; --x){
        if(selectors.item(x).checked==false){
            console.log(selectors.item(x));
            for(let i = 0; i < csvImport.length;i++){
                let z = csvImport[i].splice(x,1);
            }
        }
    }
    console.log(csvImport)
    ipc.saveImport(csvImport);
    window.close();
})

document.getElementById("csv").addEventListener("click", async () => {
    let csvImport = await ipc.csvImport();
    console.log(csvImport);
  
    sessionStorage.setItem("csvImport", JSON.stringify(csvImport));

    document.getElementById("saveImport").insertAdjacentHTML("afterend", '<h1 id="selectorTitle">Which of these properties do you want each task to have?</h1>');
    document.getElementById("selectorTitle").insertAdjacentHTML("afterend", '<div id="fieldList"></div>');

    for(let i = 0; i < csvImport[0].length;i++){
        document.getElementById("fieldList").insertAdjacentHTML("beforeend", '<div id="fieldList"><input type="checkbox" class="fieldChoice">'+csvImport[0][i]+'</div>');
    }
})

