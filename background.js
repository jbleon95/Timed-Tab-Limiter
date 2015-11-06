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
	updateTab(tab.tabId);
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

chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.settings == "updated")
        updateSettings();
  });


var tabCount = 0;

var settings = {
	timerLength: 300,
    tabGoal: 10,
    tabLimit: 15
};

totalTabTimers = {};

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

var updateTab = function(tabID) {
    if (totalTabTimers[tabID] !== undefined){
        totalTabTimers[tabID].timer = totalTabTimers[tabID].baseTime;
    	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    		totalTabTimers[tabID].url = tabs[0].url;
		});
    }
};

var updateTimers = function(tabID){
    var timeInterval = settings.timerLength/(settings.tabLimit - settings.tabGoal);
    if (timeInterval % 1 !== 0){
            timeInterval = Math.ceil(timeInterval);
    }
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
    else {
        for (var i = 0; i < timedTabList.length; i++){
                console.log(timedTabList[i]);
                totalTabTimers[timedTabList[i]].baseTime += timeInterval;
                totalTabTimers[timedTabList[i]].timer += timeInterval;
        }
        delete totalTabTimers[timedTabList[0]];
    }
}

var updateURL = function(tab) {
    if (totalTabTimers[tab.id] !== undefined){
        totalTabTimers[tab.id].url = tab.url;
    }
}

var countdown = function() {
	setInterval(function () {
    for (var tabID in totalTabTimers){
        totalTabTimers[tabID].timer--;
    }
    removeTabs();
}, 1000);
};

var removeTabs = function() {
    for (var tabId in totalTabTimers) {
        if (totalTabTimers[tabId].timer <= 0) {
            chrome.tabs.remove(parseInt(tabId));
            delete totalTabTimers[tabId];
        }
    }
};

var updateSettings = function() {
    chrome.storage.sync.get("settings", function(items) {
        settings.timerLength = items.settings.timerLength;
        settings.tabGoal = items.settings.tabGoal;
        settings.tabLimit = items.settings.tabLimit;
    });
};


var notOptions = function(tab) {
    var URL = tab.url;
    var endURL = URL.substr(URL.length - 12);
    return endURL !== 'options.html'
};

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