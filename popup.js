let filterList = document.getElementById("filterList");
let info = document.getElementById("info");
let optionsEl = document.getElementById("openOptions");

chrome.storage.sync.get("text", function(data) {
  filterList.innerHTML = data.text.join(", ");
  filterList.setAttribute("value", data.text);
});

let toggleFilter = document.getElementById("filter-toggle");
let toggleFilterLabel = document.getElementById("filter-toggle-label");

function filter(selectedOptions) {
  const teaserBlurredStyle = "filter: blur(10px); pointer-events: none";
  const overlayInitialStyle =
    "position: absolute; top: 0; left: 0; height: 100%; width: 100%; display: flex; flex-direction: column; justify-content: center;";

  chrome.storage.sync.get("isFiltered", function(data) {
    if (!data.isFiltered) {
      chrome.storage.sync.set({ isFiltered: true });

      let total = 0;

      document.querySelectorAll(".o-teaser").forEach(function(el) {
        let topNode = el;
        const tag = topNode.querySelector(".o-teaser__tag");

        let isHidden = true;

        let label = "";
        if (tag) {
          label = tag
            .getAttribute("aria-label")
            .split("Category:")[1]
            .trim()
            .toLowerCase();
        }

        const titleNode = topNode.querySelector(".js-teaser-heading-link");
        const standfirstNode = topNode.querySelector(".o-teaser__standfirst");
        const title = titleNode ? titleNode.innerHTML.toLowerCase() : "";
        const standfirst = standfirstNode
          ? standfirstNode.innerHTML.toLowerCase()
          : "";

        if (
          selectedOptions.includes(label) ||
          selectedOptions.some(d => title.includes(d)) ||
          selectedOptions.some(d => standfirst.includes(d))
        ) {
          total += 1;

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
            "position: absolute; top: 0; right: 0; border: none; padding: 5px 8px; z-index: 1;";
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
      });
      chrome.storage.sync.set({ total: total });
    } else {
      chrome.storage.sync.set({ isFiltered: false });

      document.querySelectorAll(".teaser-wrapper").forEach(function(el) {
        const originalEl = el.querySelector(".o-teaser");
        const isVideoPlayer = originalEl
          .getAttribute("class")
          .includes("o-teaser--now-playing");

        if (isVideoPlayer) {
          const videoEl = el.querySelector(".video-section__column--player");
          el.parentNode.replaceChild(videoEl, el);
          videoEl.style = "none";
        } else {
          el.parentNode.replaceChild(originalEl, el);
          originalEl.style = "none";
        }
      });
    }
  });
}

toggleFilter.onclick = function(element) {
  chrome.storage.sync.get("isFiltered", function(data) {
    toggleFilterLabel.innerHTML = !data.isFiltered ? "ON" : "OFF";

    chrome.storage.sync.get("total", function(d) {
      if (!data.isFiltered) {
        info.innerHTML = `Currently hiding ${d.total} articles`;
        filterList.setAttribute("value", d.total);
      } else {
        info.innerHTML = "";
        filterList.setAttribute("value", "");
      }
    });

    chrome.storage.sync.get("text", function(data) {
      let selectedOptions = data.text;
      let selectedOptionsString = `[${selectedOptions
        .map(t => `"${t.toLowerCase()}"`)
        .join(",")}]`;

      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, {
          code: String(filter) + `filter(${selectedOptionsString})`
        });
      });
    });
  });
};

optionsEl.onclick = function() {
  console.log("hello");
  chrome.tabs.create({ url: "/options.html" });
};
