/*document.addEventListener('DOMContentLoaded', function () {
   var bg = chrome.extension.getBackgroundPage();
   var statusText = ""
   setInterval(function () {
        var statusText = bg.totalTabTimers;
    }, 1000);
    document.getElementById('status').textContent = statusText;
});


function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}*/

var updateWindow = function() {
   var bg = chrome.extension.getBackgroundPage();
   var statusText = "";
   setInterval(function () {
   		statusText = "";
   		for (var tabID in bg.totalTabTimers){
   			statusText += bg.totalTabTimers[tabID].url + ': ' + bg.totalTabTimers[tabID].timer + '\n';
    	}
    	document.getElementById('status').textContent = statusText;
      document.getElementById('tabCount').textContent = bg.tabCount;
      document.getElementById('tabGoal').textContent = bg.settings.tabGoal;
    }, 100);
}

updateWindow();