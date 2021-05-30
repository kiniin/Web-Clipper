chrome.storage.local.get(['img'], function(result) {
  document.getElementById("pic").src = result.img;
});