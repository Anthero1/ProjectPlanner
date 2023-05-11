document.getElementById("saveImport").addEventListener("click", () => {
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
    let children = document.getElementsByTagName("body").item(0).childNodes;
    console.log(children);
    for(let i = 4; i < children.length-2; i++){
        //console.log(children.item(i))
        children.item(i).remove();
    }
    document.getElementById("saveImport").insertAdjacentHTML("afterend",'<br><div class="lds-dual-ring"></div>');

    csvImport = await ipc.csvImport();


    
    document.getElementsByTagName("br").item(0).remove();
    document.getElementsByClassName("lds-dual-ring").item(0).remove();
    document.getElementById("saveImport").insertAdjacentHTML("afterend", '<h1 id="selectorTitle">Select the columns that you want to keep as task details:</h1>');
    document.getElementById("selectorTitle").insertAdjacentHTML("afterend", '<table id="fieldList"></table>');
    
    document.getElementById("fieldList").insertAdjacentHTML("beforeend", '<tr class="importRow" data-row-num="-1"></tr>')
    for(let i = 0; i < csvImport[0].length;i++){
        document.getElementsByClassName("importRow").item(0).insertAdjacentHTML("beforeend", '<td ><input type="checkbox" class="fieldChoice"></td>');
    }

    for(let i = 0; i < csvImport.length;i++){
        document.getElementById("fieldList").insertAdjacentHTML("beforeend", '<tr class="importRow" data-row-num="'+i+'"></tr>')
        for(let x = 0; x < csvImport[i].length;x++){
            document.querySelector((".importRow[data-row-num='"+i+"']")).insertAdjacentHTML("beforeend", "<td>"+csvImport[i][x]+"</td>")
        }
    }
})

let csvImport = null;

