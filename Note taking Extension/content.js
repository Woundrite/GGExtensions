chrome.runtime.onMessage.addListener(
  // this is the message listener
  (request, sender, sendResponse) => {
		if (request.message === "copyText") {
			navigator.clipboard.writeText(window.location.href + "#:~:text=" + request.text);
			sendResponse(window.location.href + "#:~:text=" + request.text);
		}
  }
);
