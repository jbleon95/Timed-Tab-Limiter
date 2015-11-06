// Name: Jeremy Leon
// Course: CSC 415
// Semester: Fall 2015
// Instructor: Dr. Pulimood
// Project name: Timed Tab Limiter
// Description: Puts timers on Tabs created over specified Tab Goal up to specified Tab Limit
// Filename: background.js
// Description: Manages creating tabs, keeping track of their attributes, counting down the timers, and tab removal
// Last modified on: 11/6/15

var tabCount = 0;

//Settings initialized at defualt values
var settings = {
    timerLength: 300,
    tabGoal: 10,
    tabLimit: 15
};

totalTabTimers = {};

chrome.tabs.onCreated.addListener(function(tab) {
    tabCount++;
    if (tabCount > settings.tabLimit){
        chrome.tabs.remove(parseInt(tab.id));
    }
    else if (tabCount > settings.tabGoal){
        addTab(tab);
    }
});

chrome.tabs.onActivated.addListener(function(tab) {
	activateTab(tab.tabId);
});

chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab) {
	updateURL(tab);
});

chrome.tabs.onRemoved.addListener(function(tabID) {
    tabCount--;
    if ((tabCount > settings.tabGoal) && (tabCount < settings.tabLimit)){
        updateTimers(tabID);
    }
    if (tabID in totalTabTimers){
        delete totalTabTimers[tabID];
    }
	
});

chrome.tabs.onReplaced.addListener(function(addedTabId, removedTabId) {
    totalTabTimers[addedTabId] = totalTabTimers[removedTabId];
    delete totalTabTimers[removedTabId];
});

//Updates settings after succesfull option save
chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.settings == "updated")
        updateSettings();
});

//-----------------------------------------------------------------------------------------
//
//  Function: addTab ()
//
//    Parameters:    
//    input tab: tab object
//    
//    Pre-condition: tabCount must be over tabGoal, new tab is opened
//    Post-condition: Opened tab is now timed
//-----------------------------------------------------------------------------------------
var addTab = function(tab) {
    if (totalTabTimers[tab.id] === undefined && notOptions(tab)){
        var time = settings.timerLength*(1 - ((tabCount - settings.tabGoal)-1)/(settings.tabLimit - settings.tabGoal));
        if (time % 1 !== 0){
            time = Math.ceil(time);
        }
        totalTabTimers[tab.id] = {
            baseTime : time,
        	timer : time,
        	url : tab.url
    }
   }
};

//-----------------------------------------------------------------------------------------
//
//  Function: notOptions ()
//
//    Parameters:    
//    input tab: tab object
//    
//    Pre-condition: tab is trying to have timer added
//    Post-condition: timer is ensured that it is not the options page,
//                    so the options page is never timed
//-----------------------------------------------------------------------------------------
var notOptions = function(tab) {
    var URL = tab.url;
    var endURL = URL.substr(URL.length - 12);
    return endURL !== 'options.html'
};


//-----------------------------------------------------------------------------------------
//
//  Function: activateTab ()
//
//    Parameters:    
//    input tabID: ID of updated Tab
//    
//    Pre-condition: Tab is activated
//    Post-condition: If tab is timed, updates its URL attribute
//-----------------------------------------------------------------------------------------
var activateTab = function(tabID) {
    if (totalTabTimers[tabID] !== undefined){
        totalTabTimers[tabID].timer = totalTabTimers[tabID].baseTime;
    	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    		totalTabTimers[tabID].url = tabs[0].url;
		});
    }
};

//-----------------------------------------------------------------------------------------
//
//  Function: updateURL ()
//
//    Parameters:    
//    input tab: tab object
//    
//    Pre-condition: Tab is updated
//    Post-condition: If tab is timed, updates the tab's URL attribute
//-----------------------------------------------------------------------------------------
var updateURL = function(tab) {
    if (totalTabTimers[tab.id] !== undefined){
        totalTabTimers[tab.id].url = tab.url;
    }
}

//-----------------------------------------------------------------------------------------
//
//  Function: updateTimers ()
//
//    Parameters:    
//    input tabID: ID of updated Tab
//    
//    Pre-condition: Timed tabs exist and tab is removed
//    Post-condition: All tab timers are updated so base timer length
//                    and any iteratively smaller timer lengths are represented
//                    by currently timed tabs
//-----------------------------------------------------------------------------------------
var updateTimers = function(tabID){
    //keeps track of interval timers are changing at and ensures it is a whole number
    var timeInterval = settings.timerLength/(settings.tabLimit - settings.tabGoal);
    if (timeInterval % 1 !== 0){
            timeInterval = Math.floor(timeInterval);
    }

    //tabIDs are sorted into an array from highest baseTime to lowest baseTime
    var timedTabList = [];
    for (var tabs in totalTabTimers){
        timedTabList.push(Number(tabs));
    }
    timedTabList.sort(function(a,b) {
        if (totalTabTimers[a].baseTime < totalTabTimers[b].baseTime)
            return 1;
        if (totalTabTimers[a].baseTime > totalTabTimers[b].baseTime)
            return -1;
        return 0;
    });

    //if Tab closed had a timer on it, increases any timer less than its base length by determnined interval
    if (tabID in totalTabTimers){
        if (tabID !== timedTabList[timedTabList.length - 1]){
            var tabIndex = 0;
            for (var j = 0; j < (timedTabList.length - 1); j++){
                console.log(timedTabList[j])
                if (tabID === timedTabList[j]){
                    tabIndex = j;
                    break;
                }
            }
            for (var i = tabIndex; i < timedTabList.length; i++){
                totalTabTimers[timedTabList[i]].baseTime += timeInterval;
                totalTabTimers[timedTabList[i]].timer += timeInterval;
            }
        }
    }
    //if Tab closed was untimed, updates all the timers and deletes the highest baseTime timer
    else {
        for (var i = 0; i < timedTabList.length; i++){
                console.log(timedTabList[i]);
                totalTabTimers[timedTabList[i]].baseTime += timeInterval;
                totalTabTimers[timedTabList[i]].timer += timeInterval;
        }
        delete totalTabTimers[timedTabList[0]];
    }
}

//-----------------------------------------------------------------------------------------
//
//  Function: updateSettings ()
//
//    Pre-condition: Options are saved in options menu or extension is started
//    Post-condition: Settings are updated to user preference
//-----------------------------------------------------------------------------------------
var updateSettings = function() {
    chrome.storage.sync.get("settings", function(items) {
        settings.timerLength = items.settings.timerLength;
        settings.tabGoal = items.settings.tabGoal;
        settings.tabLimit = items.settings.tabLimit;
    });
};


//-----------------------------------------------------------------------------------------
//
//  Function: countdown ()
//
//    Pre-condition: Extension is started
//    Post-condition: N/A
//-----------------------------------------------------------------------------------------
var countdown = function() {
	setInterval(function () {
    for (var tabID in totalTabTimers){
        totalTabTimers[tabID].timer--;
    }
    removeTabs();
}, 1000);
};

//-----------------------------------------------------------------------------------------
//
//  Function: removeTabs()
//
//    Pre-condition: 1 second has passed
//    Post-condition: any tabs that have reach a time of 0 are closed
//                    and removed from totalTabTimers object
//-----------------------------------------------------------------------------------------
var removeTabs = function() {
    for (var tabId in totalTabTimers) {
        if (totalTabTimers[tabId].timer <= 0) {
            chrome.tabs.remove(parseInt(tabId));
            chrome.runtime.sendMessage({
                removalEvent: "timeout"
            });
        }
    }
};


//-----------------------------------------------------------------------------------------
//
//  Function: getTabCount ()
//
//    Parameters:    
//    input tab: tab object
//    
//    Pre-condition: Extension is started
//    Post-condition: tabCount updated to match total number of tabs opened
//-----------------------------------------------------------------------------------------
var getTabCount = function(tab) {
    chrome.windows.getAll({"populate" : true}, function(windows) {
        for(var i = 0; i < windows.length; i++)
        {
            tabCount += windows[i].tabs.length;
        }
    });
};

getTabCount();
updateSettings();
countdown();