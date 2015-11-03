
function loadOptions() {
    chrome.storage.sync.get("timerLength", function(items) {
        if (items.timerLength !== undefined) {
            document.getElementById('time').value = items.timerLength;
        }
        else {
            document.getElementById('time').value = 300;
        }
  });
}

function saveOptions() {
    var time = +document.getElementById("time").value;
    if (isInteger(time) && time > 0){
        chrome.storage.sync.set({"timerLength": time}, function() {
            console.log(time);
            updateStatus('Options saved.', 750)
      });
    }
    else if (isInteger(time)) {
        updateStatus('Timer Length must be greater than zero.', 2000)
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

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click',
    saveOptions);