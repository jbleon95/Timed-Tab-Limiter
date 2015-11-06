// Name: Jeremy Leon
// Course: CSC 415
// Semester: Fall 2015
// Instructor: Dr. Pulimood
// Project name: Timed Tab Limiter
// Description: Puts timers on Tabs created over specified Tab Goal up to specified Tab Limit
// Filename: options.js
// Description: Controls options page and ensures valid input of settings
// Last modified on: 11/6/15

//-----------------------------------------------------------------------------------------
//
//  Function: loadOptions ()
//
//    Pre-condition: Options page is loaded
//    Post-condition: input text boxes are filled with saved values
//-----------------------------------------------------------------------------------------
function loadOptions() {
    chrome.storage.sync.get("settings", function(items) {
        loadSetting(items.settings.timerLength, 'time', 300);
        loadSetting(items.settings.tabGoal, 'tabGoal', 10);
        loadSetting(items.settings.tabLimit, 'tabLimit', 15);
  });
}

//-----------------------------------------------------------------------------------------
//
//  Function: loadSetting ()
//
//    Parameters:    
//    setting: setting being loaded
//    element: name of the HTML input text being updated
//    defualtSetting: if setting fails to load, sets it at defualt value
//    
//    Pre-condition: Options page is loaded
//    Post-condition: input text box matched saved value
//-----------------------------------------------------------------------------------------
function loadSetting(setting, element, defaultSetting) {
    if (setting !== undefined){
        document.getElementById(element).value = setting;
    }
    else {
        document.getElementById(element).value = defaultSetting;
    }
}

//-----------------------------------------------------------------------------------------
//
//  Function: saveOptions ()
//
//    Pre-condition: User presses save button
//    Post-condition: If all settings are whole numbers greater than zeros, and tabGoal is 
//                    less than tabLimit, saves the entered options and sends message to
//                    background.js to update settings object. Otherwise, tells user why
//                    entered values are invalid
//-----------------------------------------------------------------------------------------
function saveOptions() {
    var time = +document.getElementById("time").value;
    var tabGoal = +document.getElementById("tabGoal").value;
    var tabLimit = +document.getElementById("tabLimit").value;
    if (tabLimit <= tabGoal){
        updateStatus('Tab Goal must be less than Tab Limit', 2000)
    }
    else if (validInput(time) && validInput(tabGoal) && validInput(tabLimit)){
        chrome.storage.sync.set({
            "settings": {
                "timerLength": time,
                "tabGoal": tabGoal,
                "tabLimit" : tabLimit
            }
        }, function() {
            chrome.runtime.sendMessage({
                settings: "updated"
            });
            updateStatus('Options saved.', 750)
      });
    }
    else if (isInteger(time) && isInteger(tabGoal) && isInteger(tabLimit)) {
        updateStatus('Parameters must be greater than zero.', 2000)
    }
    else {
        updateStatus('Not a whole number.', 2000)
    }
}

//-----------------------------------------------------------------------------------------
//
//  Function: updateStatus ()
//
//    Parameters:    
//    msg: messagre to be displayed
//    length: amount of time in milliseconds to display message
//    
//    Pre-condition: Options are saved
//    Post-condition: Entered message is displayed on the options page for length
//-----------------------------------------------------------------------------------------
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


//-----------------------------------------------------------------------------------------
//
//  Function: isInteger ()
//
//    Parameters:    
//    x: value being checked
//    
//    Pre-condition: Options are saved
//    Post-condition: boolean value is set true if x is an integer, else false
//-----------------------------------------------------------------------------------------
function isInteger(x) {
        return (typeof x === 'number') && (x % 1 === 0);
    }

//-----------------------------------------------------------------------------------------
//
//  Function: validInput ()
//
//    Parameters:    
//    input: value being checked
//    
//    Pre-condition: Options are saved
//    Post-condition: boolean value is set true if input is an integer and greater than zero
//-----------------------------------------------------------------------------------------
function validInput(input) {
    return isInteger(input) && input > 0
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click',
    saveOptions);