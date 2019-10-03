let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute("value", data.color);
});

function filter() {
  document.querySelectorAll(".o-teaser").forEach(function(el) {
    const tag = el.querySelector(".o-teaser__tag");
    if (tag) {
      const label = tag
        .getAttribute("aria-label")
        .split("Category:")[1]
        .trim();
      if (label === "Brexit") {
        el.style.filter = "blur(4px)";
      }
    }
  });
}

changeColor.onclick = function(element) {
  let color = element.target.value;
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      code: String(filter) + "filter();"
    });
  });
};
