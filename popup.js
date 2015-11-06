// Name: Jeremy Leon
// Course: CSC 415
// Semester: Fall 2015
// Instructor: Dr. Pulimood
// Project name: Timed Tab Limiter
// Description: Puts timers on Tabs created over specified Tab Goal up to specified Tab Limit
// Filename: popup.js
// Description: Updates popup with latest info on settings, tabCount, and timers
// Last modified on: 11/6/15


//-----------------------------------------------------------------------------------------
//
//  Function: updateWindow ()
//
//    Pre-condition: Extension is started
//    Post-condition: popup window is constantly updated with latest values
//-----------------------------------------------------------------------------------------
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