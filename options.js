function loadOptions() {
    chrome.storage.sync.get("settings", function(items) {
        loadSetting(items.settings.timerLength, 'time', 300);
        loadSetting(items.settings.tabGoal, 'tabGoal', 10);
  });
}

function loadSetting(setting, element, defaultSetting) {
    if (setting !== undefined){
        document.getElementById(element).value = setting;
    }
    else {
        document.getElementById(element).value = defaultSetting;
    }
}

function saveOptions() {
    var time = +document.getElementById("time").value;
    var tabGoal = +document.getElementById("tabGoal").value;
    if (validInput(time) && validInput(tabGoal)){
        chrome.storage.sync.set({
            "settings": {
                "timerLength": time,
                "tabGoal": tabGoal
            }
        }, function() {
            chrome.runtime.sendMessage({
                settings: "updated"
            });
            updateStatus('Options saved.', 750)
      });
    }
    else if (isInteger(time) && isInteger(tabGoal)) {
        updateStatus('Parameters must be greater than zero.', 2000)
    }
    else {
        updateStatus('Not an Integer.', 2000)
    }
}

function updateStatus(msg, length) {
    if (length === undefined) {
        length = 1000
    }  
    var status = document.getElementById('status');
        status.textContent = msg;
        setTimeout(function() {
            status.textContent = '';
        }, length);
}

function isInteger(x) {
        return (typeof x === 'number') && (x % 1 === 0);
    }

function validInput(input) {
    return isInteger(input) && input > 0
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click',
    saveOptions);