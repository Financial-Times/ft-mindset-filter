let page = document.getElementById("buttonDiv");

const kButtonColors = ["Brexit", "Donald Trump", "House"];

function constructOptions(kButtonColors) {
  for (let item of kButtonColors) {
    let button = document.createElement("button");
    button.innerHTML = item;
    button.setAttribute("class", "o-buttons o-buttons--big mg-16");

    chrome.storage.sync.get("text", function(data) {
      let arr = data.text;
      if (arr.includes(item)) {
        button.setAttribute(
          "class",
          "o-buttons o-buttons--primary o-buttons--big mg-16"
        );
      }
    });

    button.addEventListener("click", function() {
      button.setAttribute(
        "class",
        "o-buttons o-buttons--primary o-buttons--big mg-16"
      );
      chrome.storage.sync.get("text", function(data) {
        let arr = data.text;
        if (!arr.includes(item)) {
          arr.push(item);
        } else {
          arr = arr.filter(d => d !== item);
          button.setAttribute("class", "o-buttons o-buttons--big mg-16");
        }
        chrome.storage.sync.set({ text: arr });
      });
    });
    page.appendChild(button);
  }
}
constructOptions(kButtonColors);
