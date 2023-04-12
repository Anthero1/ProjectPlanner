document.addEventListener("DOMContentLoaded", () => {

    critList = JSON.parse(sessionStorage.getItem("critList"));
    compList = JSON.parse(sessionStorage.getItem("compList"));

    for(var i = 0; i <critList.length; i++){
        for(var x = i+1; x < critList.length; x++){

            document.getElementsByClassName("critRanker").item(0).insertAdjacentHTML("beforeend", '<div class="comparison" data-comp-num="'+document.getElementsByClassName("comparison").length+'"></div>')
            var currentComp = document.getElementsByClassName("comparison").length-1;
            
            document.getElementsByClassName("comparison").item(currentComp).insertAdjacentHTML("beforeend", '<p class="leftCrit">'+critList[i][0]+'</p>');
            for(var z = -9; z <= 9; z++){
                if(z==-1){
                    z+=2;
                }
                try{
                    if(compList[currentComp]===z){
                        document.getElementsByClassName("comparison").item(currentComp).insertAdjacentHTML("beforeend", '<input type="checkbox" class="rankChoice" data-choice="'+z+'" checked />');
                    }else{
                        document.getElementsByClassName("comparison").item(currentComp).insertAdjacentHTML("beforeend", '<input type="checkbox" class="rankChoice" data-choice="'+z+'"/>');
                    }
                }catch(e){
                    document.getElementsByClassName("comparison").item(x+i-1).insertAdjacentHTML("beforeend", '<input type="checkbox" class="rankChoice" data-choice="'+z+'"/>');
                }
            }
            document.getElementsByClassName("comparison").item(currentComp).insertAdjacentHTML("beforeend", '<p class="rightCrit">'+critList[x][0]+'</p>');
        }
    }
})

document.getElementsByClassName("critRanker").item(0).addEventListener("click", (event) => {
    compList = JSON.parse(sessionStorage.getItem("compList"));

    if(event.target.className==="rankChoice"){
        compList[event.target.parentNode.getAttribute("data-comp-num")]=parseInt(event.target.getAttribute("data-choice"), 10);
        
        
        for(var i = 0; i < 17; i++){
            if(event.target.parentNode.getElementsByClassName("rankChoice").item(i).getAttribute("data-choice") != compList[event.target.parentNode.getAttribute("data-comp-num")]){
                event.target.parentNode.getElementsByClassName("rankChoice").item(i).checked = false;
            }
        }
    }

    sessionStorage.setItem("compList", JSON.stringify(compList));

})