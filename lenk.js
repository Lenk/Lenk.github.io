const list = document.querySelector("#list");
const body = document.querySelector("body");
const toggleButton = document.querySelector("#toggle-button");
const downloadButton = document.querySelector("#download-button");

list.addEventListener("dragstart", function(event) {
  event.dataTransfer.setData("text", event.target.
  event.dataTransfer.setData("text", event.target.dataset.value);
});

const dropBox = document.querySelector(".drop-box");

dropBox.addEventListener("dragover", function(event) {
  event.preventDefault();
});

dropBox.addEventListener("drop", function(event) {
  event.preventDefault();
  const value = event.dataTransfer.getData("text");
  const item = document.createElement("li");
  item.textContent = `Item ${value}`;
  item.setAttribute("data-value", value);
  dropBox.appendChild(item);
});

const addItemButton = document.querySelector("#add-item-button");
const itemInput = document.querySelector("#item-input");

addItemButton.addEventListener("click", function() {
  const value = itemInput.value;
  const item = document.createElement("li");
  item.textContent = `Item ${value}`;
  item.setAttribute("data-value", value);
  item.setAttribute("draggable", "true");
  list.appendChild(item);
});

toggleButton.addEventListener("click", function() {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    toggleButton.src = "dark-mode-icon.png";
  } else {
    toggleButton.src = "light-mode-icon.png";
  }
});

downloadButton.addEventListener("click", function() {
  const dropBoxItems = document.querySelectorAll(".drop-box li");
  if (dropBoxItems.length === 0) {
    return;
  }
  let content = "";
  for (const item of dropBoxItems) {
    content += item.dataset.value + "\n";
  }
  const blob = new Blob([content], {type: "text/plain"});
  const a = document.createElement("a");
  a.download = "data.txt";
  a.href = URL.createObjectURL(blob);
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

document.addEventListener("touchstart", function(event) {
  event.target.classList.add("touch-drag-start");
});

document.addEventListener("touchend", function(event) {
  event.target.classList.remove("touch-drag-start");
});

document.addEventListener("touchmove", function(event) {
  const target = event.target;
  if (!target.classList.contains("touch-drag-start")) {
    return;
  }
  if (!target.classList.contains("list-item")) {
    return;
  }
  event.preventDefault();
  event.dataTransfer = {
    setData: function(type, value) {
      this[type] = value;
    }
  };
