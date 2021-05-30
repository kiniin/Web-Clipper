var scrollWidth = document.documentElement.scrollWidth;
var scrollHeight = document.documentElement.scrollHeight;
var visibleWidth = document.documentElement.clientWidth;
var visibleHeight = document.documentElement.clientHeight;

// 根据可视区域计算整个网页可以拆分成多少行多少列 
var columns = Math.ceil(scrollWidth*1.0 / visibleWidth); 
var rows = Math.ceil(scrollHeight*1.0 / visibleHeight); 
// console.log(columns,rows);


var canvas_data = {
  size: {full_width: scrollWidth, full_height: scrollHeight, page_width: visibleWidth, page_height:visibleHeight},
  table:{rows: rows, columns: columns},
  screenshots: [] 
};

chrome.storage.local.set({canvas: canvas_data}, function() {
  console.log('Value is set to ' + canvas_data);
});

//短连接(GetHTML)
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(sender.tab ?
    //             "from a content script:" + sender.tab.url :
    //             "from the extension");
    if (request.action == "GetText")//判断是否为要处理的消息
    {
      // var text = document.documentElement.innerText;
      var html = document.documentElement.innerHTML;
      sendResponse({html: html});
    }
});

//区域截屏
chrome.runtime.onConnect.addListener(function(port) {
	console.log(port);
	if(port.name == 'SelectScreen-connect') {
		port.onMessage.addListener(function(msg) {
			console.log('receive message:', msg);
			if(msg.action == 'StartPoint') {
        document.onclick = function (event){
          var x = event.clientX;
          var y = event.clientY;
          // console.log("StartPoint",x,y);
          port.postMessage({action:'StartPoint', StartPointX: x, StartPointY: y});
        }
      }else if(msg.action == 'EndPoint') {
        document.onclick = function (event){
          var x = event.clientX;
          var y = event.clientY;
          // console.log("EndPoint",x,y);
          port.postMessage({action:'EndPoint', EndPointX: x, EndPointY: y});
        }
      }else if(msg.action == 'Final'){
        port.postMessage({action:'Final'});
      }
    });
  }
});

//滑动截屏
// chrome.runtime.onConnect.addListener(function(port) {
// 	console.log(port);
// 	if(port.name == 'capture-connect') {
// 		port.onMessage.addListener(function(msg) {
// 			console.log('receive message:', msg);
// 			if(msg.capture == 'EntirePage') {
//         var scrollWidth = document.documentElement.scrollWidth;
//         var scrollHeight = document.documentElement.scrollHeight;
//         var visibleWidth = document.documentElement.clientWidth;
//         var visibleHeight = document.documentElement.clientHeight;

//         // 根据可视区域计算整个网页可以拆分成多少行多少列 
//         var columns = Math.ceil(scrollWidth*1.0 / visibleWidth); 
//         var rows = Math.ceil(scrollHeight*1.0 / visibleHeight); 
//         // console.log(columns,rows);

        
//         var canvas_data = {
//           size: {full_width: scrollWidth, full_height: scrollHeight, page_width: visibleWidth, page_height:visibleHeight},
//           table:{rows: rows, columns: columns},
//           screenshots: [] 
//         };

//         var image_element = {
//           src:"",
//           type:"image/png"
//         }

//         //滚动截屏
//         for(let r=0; r<rows; r++) {     
//           // document.documentElement.scrollTop = r*visibleHeight; 
//           console.log(document.documentElement.scrollTop= r*visibleHeight);
//           port.postMessage({piecesCapture: 'capture'});
//           // 截屏并保存 
//           if(msg.screenshotUrl)
//             canvas_data.screenshots.push({row: r, column: c, data_url: msg.screenshotUrl});    
//         }
//         console.log("canvas_data.screenshots",canvas_data.screenshots);

//         merge_images(canvas_data,image_element);

//         chrome.storage.local.set({img: image_element.src}, function() {
//           console.log('Value is set to ' + image_element.src);
//         });
      
//         // chrome.windows.create({
//         //   url: chrome.runtime.getURL("ShowCapture.html"),
//         // });

//       }
// 		});
// 	}
// });