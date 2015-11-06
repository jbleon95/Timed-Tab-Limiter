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
      document.getElementById('tabLimit').textContent = bg.settings.tabLimit;
    }, 100);
}

updateWindow();