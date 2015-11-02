chrome.tabs.onCreated.addListener(function(tab) {
	addTab(tab);
});

chrome.tabs.onActivated.addListener(function(tab) {
	console.log("Tab Activated: " + tab.tabId);
	updateTab(tab.tabId);
});

chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab) {
	totalTabTimers[tabID].url = tab.url;
});

chrome.tabs.onRemoved.addListener(function(tabID) {
	delete totalTabTimers[tabID];
});

var settings = {
	timerLength: 300
};


totalTabTimers = {};

var addTab = function(tab) {
    if (totalTabTimers[tab.id] === undefined){
        totalTabTimers[tab.id] = {
        	timer : settings.timerLength,
        	url : tab.url
    }
   }
};

var updateTab = function(tabID) {
    if (totalTabTimers[tabID] !== undefined){
        totalTabTimers[tabID].timer = settings.timerLength;
    	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    		totalTabTimers[tabID].url = tabs[0].url;
		});
    }
};

var updateUrl = function(tabID) {
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    	totalTabTimers[tabID].url = tabs[0].url;
	});
}

var countdown = function() {
	setInterval(function () {
    for (var tabID in totalTabTimers){
        totalTabTimers[tabID].timer--;
        console.log(totalTabTimers[tabID].url + ': ' +totalTabTimers[tabID].timer)
    }
    removeTabs();
}, 1000);
};

var removeTabs = function(windowId) {
    for (var tabId in totalTabTimers) {
        if (totalTabTimers[tabId].timer <= 0) {
            chrome.tabs.remove(parseInt(tabId));
            delete totalTabTimers[tabId];
        }
    }
};

countdown();