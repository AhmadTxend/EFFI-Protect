// function tab()
// {
//   console.log('Btn clicked...')
//   $('#btn_check').click(function() { checkCurrentTab(); });
// }

// function checkCurrentTab() {
//   chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
//       var url = tabs[0].url;
//       console.log("checkCurrentTab: "+url);
//       $(".pg_url").text(url);

//       // request content_script to retrieve title element innerHTML from current tab
//       chrome.tabs.sendMessage(tabs[0].id, "getHeadTitle", null, function(obj) {
//           console.log("getHeadTitle.from content_script:", obj);
//           log("from content_script:"+obj);
//       });

//   });
// }

// document.addEventListener('DOMContentLoaded', () => {
//   console.log('DOMContentLoaded.');
//   const button = document.getElementById('btn_check');
//   button.addEventListener('click', () => {
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//           const tabId = tabs[0].id;
//           console.log('Current Tab ID:', tabId);
//           // Request background to inject the script
//           chrome.runtime.sendMessage({ action: 'injectScript', tabId });
//       });
//   });
// });


// function log(txt) {
//   var h = $("#log").html();
//   $("#log").html(h+"<br>"+txt);
// }


console.log('Adding listener to button...');
// document.addEventListener('DOMContentLoaded', () => {
//   console.log('DOM fully loaded, adding listener to button...');
//   const btnCheck = document.getElementById('btn_check');
  
//   if (btnCheck) {
//       btnCheck.addEventListener('click', () => {
//           chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//               const tabId = tabs[0].id;
//               console.log('tabId:',tabId);
//               // chrome.runtime.sendMessage({ action: 'injectScript', tabId });
//           });
//       });
//   } else {
//       console.error('Button with ID "btn_check" not found in the DOM.');
//   }
// });







document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("btn_check");

  // Add click event listener to the button
  button.addEventListener("click", () => {
      console.log("Hello");
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tabId = tabs[0].id;
          console.log('tabId:',tabId);  
          const logDiv = document.getElementById("log");
          logDiv.textContent = `Hello ${tabId}`;
          chrome.runtime.sendMessage({ action: 'injectScript', tabId });
      });
   
  });
});
