function replaceTargetWith(targetID, html ){
    /// find our target
    var i, tmp, elm, last, target = document.getElementById(targetID);
    /// create a temporary div or tr (to support tds)
    tmp = document.createElement(html.indexOf('<td')!=-1?'tr':'div');
    /// fill that div with our html, this generates our children
    tmp.innerHTML = html;
    /// step through the temporary div's children and insertBefore our target
    i = tmp.childNodes.length;
    /// the insertBefore method was more complicated than I first thought so I 
    /// have improved it. Have to be careful when dealing with child lists as  
    /// they are counted as live lists and so will update as and when you make
    /// changes. This is why it is best to work backwards when moving children 
    /// around, and why I'm assigning the elements I'm working with to `elm` 
    /// and `last`
    last = target;
    while(i--){
      target.parentNode.insertBefore((elm = tmp.childNodes[i]), last);
      last = elm;
    }
    /// remove the target.
    target.parentNode.removeChild(target);
  }

function addNavBar(active){
    var classType = ['notActive', 'activeTab'];
    replaceTargetWith('navbar', ('<ul class="navbar"><li><a class="'+classType[active[0]]+'"href="Mission.html">Mission</a></li><li><a class="'+classType[+active[1]]+'" href="Criteria.html">Criteria</a></li><li><a class="'+classType[active[2]]+'" href="Ranking.html">Ranking</a></li><li><a class="'+classType[active[3]]+'" href="Tasks.html">Tasks</a></li><li><a class="'+classType[active[4]]+'" href="Budget.html">Budget</a></li></ul>'));
}

const val = document.getElementsByClassName("docName");
var actives = [0,0,0,0,0];
actives[Number(val.item(0).getAttribute("name"))]=1;
addNavBar(actives);