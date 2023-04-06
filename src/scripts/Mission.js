const information = document.getElementById('info');
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;


var ObjectStorage = function(nsp, useSession) {
    var stg = (useSession ? sessionStorage : localStorage);
    return {
      // Get all or single customer by passing an ID
      get: function(id) {
        var parsed = JSON.parse(stg[nsp] || "{}");
        return id ? parsed[id] : parsed;
      },
      // Set all
      set: function(obj) {
        return stg[nsp] = JSON.stringify(obj || {});
      },
      // Add one to all
      add: function(prop, val) {
        var all = this.get();
        // Make sure property does not exists already;
        if (all.hasOwnProperty(prop)) return console.warn(prop + " exists!");
        all[prop] = val;
        return this.set(all);
      }
    }
};

// ---------------------------------------------------------------------

var mission = ObjectStorage("missionStatement", true);
mission.set({
    "Mission 1": "I want to build an app for business management",
    "Mission 2": "it's gonna be super cool"
})
console.log(sessionStorage);
