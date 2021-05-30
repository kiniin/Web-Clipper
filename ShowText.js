chrome.storage.local.get(['html'], function(result) {
  document.getElementById("inner").innerHTML = result.html;
});