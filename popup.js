document.addEventListener('DOMContentLoaded', function () {
   var bg = chrome.extension.getBackgroundPage();
   var statusText = ""
   setInterval(function () {
        var statusText = bg.totalTabTimers;
    }, 1000);
    document.getElementById('status').textContent = statusText;
});


/*function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}*/