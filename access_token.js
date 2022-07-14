let url = document.querySelector("#url");
let env = document.querySelector("#env");
let email = document.querySelector("#email");
let token = document.querySelector("#token");

chrome.storage.sync.get("url", (data) => {
  url.value = data.url;
});

chrome.storage.sync.get("email", (data) => {
  email.value = data.email;
});

chrome.storage.sync.get("token", (data) => {
  token.value = data.token;
});

document.querySelector("#submit").addEventListener("click", () => {
  chrome.storage.sync.remove("token", () => {
    // console.log("cleared");
    // chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
    document.location.href = chrome.runtime.getURL("index.html");
  });
});
