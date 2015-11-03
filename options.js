
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
            var status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(function() {
                status.textContent = '';
            }, 750);
      });
    }
    else if (isInteger(time)) {
        var status = document.getElementById('status');
        status.textContent = 'Timer Length must be greater than zero.';
        setTimeout(function() {
            status.textContent = '';
        }, 1000);
    }
    else {
        var status = document.getElementById('status');
        status.textContent = 'Not an Integer.';
        setTimeout(function() {
            status.textContent = '';
        }, 1000);
    }
}

function isInteger(x) {
        return (typeof x === 'number') && (x % 1 === 0);
    }

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click',
    saveOptions);