let page = document.getElementById("buttonDiv");
let form = document.getElementById("addNewForm");

let kButtonColors = ["Brexit", "Donald Trump", "House", "Tech", "Fall"];

function addEventListenerToButton(button, item) {
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

    addEventListenerToButton(button, item);
  }
}
constructOptions(kButtonColors);

addNewForm.onsubmit = function(e) {
  e.preventDefault();
  let v = document.getElementById("addNewInput").value;

  if (!kButtonColors.includes(v)) {
    kButtonColors.push(v);
    let button = document.createElement("button");
    button.innerHTML = v;
    button.setAttribute("class", "o-buttons o-buttons--big mg-16");
    addEventListenerToButton(button, v);

    document.getElementById("addNewInput").value = "";
  }
};
