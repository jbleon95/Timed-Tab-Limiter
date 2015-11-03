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

chrome.tabs.onReplaced.addListener(function(addedTabId, removedTabId) {
    totalTabTimers[addedTabId] = totalTabTimers[removedTabId];
    delete totalTabTimers[removedTabId];
});

chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.settings == "updated")
        updateSettings();
  });

var settings = {
	timerLength: 300
};


totalTabTimers = {};

var addTab = function(tab) {
    if (totalTabTimers[tab.id] === undefined && notOptions(tab)){
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

var updateSettings = function() {
    chrome.storage.sync.get("timerLength", function(items) {
        if (items.timerLength !== undefined) {
            settings.timerLength = items.timerLength;
        }
    });
}

var notOptions = function(tab) {
    var URL = tab.url;
    var endURL = URL.substr(URL.length - 12);
    return endURL !== 'options.html'
}

updateSettings();
countdown();