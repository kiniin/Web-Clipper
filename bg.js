chrome.storage.local.get(['canvas'], function(result) {
  canvas_data = result.canvas;
  visibleWidth = result.canvas.size.page_width;
  visibleHeight = result.canvas.size.page_height;
  columns = result.canvas.table.columns;
  rows = result.canvas.table.rows;
  console.log(canvas_data);

  image_element = {
    src:"",
    type:"image/png"
  }
});

function SelectScreen(){
  // 长连接
  chrome.tabs.query(
    {active: true, currentWindow: true},
    function(tabs) {
    var port = chrome.tabs.connect(tabs[0].id, {name: 'SelectScreen-connect'});
    port.postMessage({action: 'StartPoint'});
    var startPointX = 0; var startPointY = 0;
    var endPointX = 0; var endPointY = 0;
    var i = 0;
    port.onMessage.addListener(function(msg) {
      if(msg.action == 'StartPoint' && i == 0)
      {
        startPointX = msg.StartPointX;
        startPointY = msg.StartPointY;
        port.postMessage({action: 'EndPoint'});
        i++;
      }else if(msg.action == 'EndPoint' && i == 1){
        endPointX = msg.EndPointX;
        endPointY = msg.EndPointY;
        port.postMessage({action: 'Final'});
        i++;
      }else if(msg.action == 'Final'){
        chrome.tabs.captureVisibleTab({format:'png'}, function(screenshotUrl) {
          var canvas = document.createElement("canvas");
          canvas.width = visibleWidth;
          canvas.height = visibleHeight;
          var ctx=canvas.getContext("2d");
          var img=new Image();
          img.src = screenshotUrl;

          img.onload = function(){
            //截取图片
            //ctx.drawImage(img,startPointX,startPointY,(endPointX-startPointX),(endPointY-startPointY),0,0,canvas_data.size.full_width,canvas_data.size.full_height);
            ctx.drawImage(img,startPointX,startPointY,(endPointX-startPointX),(endPointY-startPointY),0,0,(endPointX-startPointX),(endPointY-startPointY));
            var src = canvas.toDataURL();
            console.log(src);
            chrome.storage.local.set({img: src}, function() {
              console.log('Value is set to ' + src);
            });
            chrome.windows.create({
              url: chrome.runtime.getURL("ShowCapture.html"),
            });
          }
        });
      }
    });
  });
}

function GetUrl(){
  chrome.tabs.getSelected(null, function (tab) {
    alert(tab.url);
  });
}