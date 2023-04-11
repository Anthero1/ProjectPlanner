document.getElementById("saveCrit").addEventListener("click", () => {
    var title = document.getElementById("title").value;
    var weight = -1;
    var description = document.getElementById("description").value;
    var q1 = document.getElementById("lead").value;
    var q2 = document.getElementById("measures").value;
    var q3 = document.getElementById("mission").value;
    var crit = [title, weight, description, q1, q2, q3]
    ipc.saveCrit(crit);
    window.close();
})

document.getElementById("title").addEventListener("keypress", function(event) {
    if((event.target.value.length) > 19){
        event.preventDefault();
    }
})
