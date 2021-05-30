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


function VisiblePage(){
  chrome.tabs.captureVisibleTab({format:'png'}, function(screenshotUrl) {
    chrome.storage.local.set({img: screenshotUrl}, function() {
      console.log('Value is set to ' + screenshotUrl);
    });
  });
  chrome.windows.create({
    url: chrome.runtime.getURL("ShowCapture.html"),
  });
}

// function sendMessageToContentScript()
// {
//   // 长连接
//   // chrome.tabs.query(
//   //   {active: true, currentWindow: true},
//   //   function(tabId) {
//   //   var port = chrome.tabs.connect(tabId[0].id, {name: 'capture-connect'});
//   //   port.postMessage({capture: 'EntirePage'});
//   //   var i = 0;
//   //   port.onMessage.addListener(function(msg) {
//   //     if(msg.piecesCapture && msg.piecesCapture == 'capture')
//   //     {
//   //       i++;
//   //       chrome.tabs.captureVisibleTab({format:'png'}, function(screenshotUrl) {
//   //         port.postMessage({screenshotUrl: screenshotUrl,OK: 'ok'+i});
//   //         console.log(i);
//   //         console.log(screenshotUrl);
//   //       });
//   //     }
//   //   });
//   // });

//   //滚动截屏
//   for(let r=0; r<rows; r++) {  
//     chrome.tabs.executeScript({
//       code: 'document.documentElement.scrollTop ='+ r*visibleHeight
//     });  
//     // console.log(document.documentElement.scrollTop= r*visibleHeight);
//     // for(var c=0; c<columns; c++) { 
//     //   chrome.tabs.executeScript({
//     //     code: 'document.documentElement.scrollTop ='+ c*visibleWidth
//     //   }); 
//       // 截屏并保存 
//       chrome.tabs.captureVisibleTab({format:'png'}, function(screenshotUrl) {
//         canvas_data.screenshots.push({row: r, data_url: screenshotUrl});
//       });
//       sleep(100);
//     // }
//   } 
//   console.log("canvas_data.screenshots",canvas_data.screenshots);
    
//   merge_images(canvas_data,image_element);
    
//   chrome.storage.local.set({img: image_element.src}, function() {
//     console.log('Value is set to ' + image_element.src);
//   });
          
//   chrome.windows.create({
//     url: chrome.runtime.getURL("ShowCapture.html"),
//   });
// }

// function merge_images(canvas_data, image_element) {
//   // initialize canvas
//   var canvas = document.createElement("canvas");
//   canvas.width = canvas_data.size.full_width;
//   canvas.height = canvas_data.size.full_height;
//   draw_image(canvas, canvas_data, 0, image_element);
// }

// function draw_image(canvas, canvas_data, n, image_element) {
//   var screenshots = canvas_data.screenshots;
//   if(n >= screenshots.length) {
//     // draw completed
//     image_element.src = canvas.toDataURL('image/png');
//   } else {
//     console.log('draw '+n+' image');
//     var draw_context = canvas.getContext("2d");
//     var s = screenshots[n];
//     var row = s.row;
//     var column = s.column;
//     var x=0, y=0;
//     if(row < canvas_data.table.rows-1) {
//       y = row*canvas_data.size.page_height;
//     } else { // last row
//       y = canvas.height - canvas_data.size.page_height; 
//     }

//     if(column < canvas_data.table.columns-1) {
//       x = column*canvas_data.size.page_width;
//     } else { // last column
//       x = canvas.width - canvas_data.size.page_width; 
//     }
//     console.log('x:' + x + ', y=' + y); 
//     var memory_image = new Image();
//     memory_image.onload =  (function(ctx, m, l, t) { 
//       return function() {
//         console.log('image load ok');
//         ctx.drawImage(m,l,t); 
//         draw_image(canvas, canvas_data, ++n, image_element);
//       }
//     })(draw_context, memory_image, x, y);
//     memory_image.src = s.data_url;
//   }
// }

function SelectScreen(){
  var bg = chrome.extension.getBackgroundPage();
  bg.SelectScreen();
}

function getUrl(){
  var bg = chrome.extension.getBackgroundPage();
  bg.GetUrl();
}

function Login(){
  chrome.tabs.create({ url: "https://account.wps.com/?cb=https://docs.wps.com/latest" });
}

function getText(){
  // 短连接
  chrome.tabs.query(
    {active: true, currentWindow: true},
    function(tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {action: "GetText"},
        function(response) {
          chrome.storage.local.set({html: response.html}, function() {
            console.log('successful');
          });
          chrome.windows.create({
            url: chrome.runtime.getURL("ShowText.html"),
          });
      });
  });
}

function sleep(numberMillis) { 
  var now = new Date(); 
  var exitTime = now.getTime() + numberMillis; 
  while (true) { 
  now = new Date(); 
  if (now.getTime() > exitTime) 
  return; 
  } 
}

document.getElementById("VisiblePage").addEventListener("click",VisiblePage);
// document.getElementById("EntirePage").addEventListener("click",sendMessageToContentScript);
document.getElementById("SelectScreen").addEventListener("click",SelectScreen);
document.getElementById("GetUrl").addEventListener("click",getUrl);
document.getElementById("GetText").addEventListener("click",getText);
document.getElementById("LoginWps").addEventListener("click",Login);

