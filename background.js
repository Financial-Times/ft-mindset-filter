chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({ isFiltered: false });
  chrome.storage.sync.set({ text: ["Brexit"] }, function() {
    console.log("The text is brexit.");
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "www.ft.com" }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});
