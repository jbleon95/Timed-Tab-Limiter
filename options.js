
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
    chrome.storage.sync.set({"timerLength": time}, function() {
        console.log(time);
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
  });
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click',
    saveOptions);