let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute("value", data.color);
});

function filter() {
  const teaserBlurredStyle = "filter: blur(10px); pointer-events: none";
  const overlayInitialStyle =
    "position: absolute; top: 0; left: 0; height: 100%; width: 100%; display: flex; flex-direction: column; justify-content: center;";

  document.querySelectorAll(".o-teaser").forEach(function(el) {
    let topNode = el;
    const tag = topNode.querySelector(".o-teaser__tag");
    if (tag) {
      let isHidden = true;

      const label = tag
        .getAttribute("aria-label")
        .split("Category:")[1]
        .trim();
      if (label === "Brexit") {
        const isVideoPlayer = topNode
          .getAttribute("class")
          .includes("o-teaser--now-playing");
        if (isVideoPlayer) {
          topNode = el.parentNode;
        }

        const wrapper = document.createElement("div");
        const copied = topNode.cloneNode(true);

        wrapper.setAttribute("class", "teaser-wrapper");
        wrapper.appendChild(copied);
        wrapper.style = isVideoPlayer
          ? "position: relative; width: 50%;"
          : "position: relative;";
        copied.style = teaserBlurredStyle;

        const overlay = document.createElement("div");
        overlay.setAttribute("class", "teaser-overlay");
        const overlayText = document.createElement("div");
        overlayText.setAttribute("class", "teaser-overlay__text");
        overlayText.innerHTML = "You have hidden this article";
        overlay.appendChild(overlayText);
        wrapper.appendChild(overlay);

        const overlayButton = document.createElement("button");
        overlayButton.innerHTML = "Reveal";
        overlayButton.style =
          "position: absolute; top: 0; right: 0; border: none; padding: 5px 8px;";
        overlay.appendChild(overlayButton);

        overlay.style = overlayInitialStyle;
        overlayText.style = "text-align: center;";
        topNode.parentNode.replaceChild(wrapper, topNode);

        overlayButton.onclick = function(buttonEl) {
          if (isHidden) {
            overlayText.style = "text-align: center; display: none";
            copied.style = "";
            overlay.style.left = "auto";
            overlay.style.right = 0;
            overlay.style.width = "auto";
            isHidden = false;
            overlayButton.innerHTML = "Hide";
          } else {
            overlayText.style = "text-align: center;";
            copied.style = teaserBlurredStyle;
            overlay.style = overlayInitialStyle;
            isHidden = true;
            overlayButton.innerHTML = "Reveal";
          }
        };
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
