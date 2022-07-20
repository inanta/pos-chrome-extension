/* global chrome */

chrome.action.onClicked.addListener(function () {
  let url = "index.html";

  chrome.storage.sync.get("token", (data) => {
    console.log("token", data.token);
    if (typeof data.token !== "undefined") {
      url += "#/file-manager";
    }

    chrome.tabs.create({ url: chrome.runtime.getURL(url) });
  });
});
