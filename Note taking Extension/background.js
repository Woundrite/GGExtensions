chrome.runtime.onInstalled.addListener( ()=> {
  chrome.contextMenus.create({
    id: "makeNote",
    title: "Make a note",
    contexts: ["selection"],
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message)
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "makeNote") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          message: "copyText",
          text:info.selectionText,
        }
      );
    });
  }
});
