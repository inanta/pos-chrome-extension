let color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log("Default background color set to %cgreen", `color: ${color}`);
});

chrome.action.onClicked.addListener(function (tab) {
  // chrome.storage.sync.get("env", (data) => {
  //   console.log(data);
  // });

  // chrome.storage.sync.get("email", (data) => {
  //   console.log(data);
  // });

  // chrome.storage.sync.get("token", (data) => {
  //   console.log(data);
  // });

  // chrome.storage.sync.get("url", (data) => {
  //   console.log(data);
  // });

  // chrome.storage.sync.get("testtest", (data) => {
  //   console.log(data);
  // });

  let url = "index.html";

  chrome.storage.sync.get("token", (data) => {
    console.log("token", data.token);
    if (typeof data.token !== "undefined") {
      url = "access_token.html";
    }

    chrome.tabs.create({ url: chrome.runtime.getURL(url) });
  });
});
