chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message && message.hasOwnProperty('setBadgeText')) {
    chrome.action.setBadgeText({ text: message.setBadgeText });
  }
});
