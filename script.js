// Elements
const noteArea = document.getElementById("note");
const highlightLayer = document.getElementById("highlightLayer");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const downloadBtn = document.getElementById("downloadBtn");
const modeToggle = document.getElementById("modeToggle");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");
const statusMsg = document.getElementById("statusMsg");

// Load saved note + theme
window.onload = () => {
  const savedNote = localStorage.getItem("myNote");
  const theme = localStorage.getItem("theme");

  if (savedNote) noteArea.value = savedNote;
  if (theme === "dark") document.body.classList.add("dark");

  updateHighlight();
  updateCounter();
};

// ====================
// SAVE / CLEAR / DOWNLOAD
// ====================

// Save note
saveBtn.addEventListener("click", () => {
  localStorage.setItem("myNote", noteArea.value);
  showStatus("✅ Note saved!");
});

// Auto-save while typing
noteArea.addEventListener("input", () => {
  localStorage.setItem("myNote", noteArea.value);
  updateHighlight(searchInput.value.trim());
  updateCounter();
  showStatus("💾 Auto-saved");
});

// Clear note
clearBtn.addEventListener("click", () => {
  noteArea.value = "";
  localStorage.removeItem("myNote");
  updateHighlight();
  updateCounter();
  showStatus("🧹 Note cleared");
});

// Download note
downloadBtn.addEventListener("click", () => {
  const blob = new Blob([noteArea.value], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "note.txt";
  link.click();
  showStatus("⬇ Download started");
});

// ====================
// THEME TOGGLE
// ====================
modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
});

// ====================
// SEARCH / HIGHLIGHT
// ====================
function updateHighlight(searchTerm = "") {
  let text = noteArea.value;

  if (searchTerm) {
    const regex = new RegExp(`(${searchTerm})`, "gi");
    text = text.replace(regex, "<mark>$1</mark>");
  }

  highlightLayer.innerHTML = text || " ";
  highlightLayer.scrollTop = noteArea.scrollTop; // sync scroll
}

// Sync scrolling
noteArea.addEventListener("scroll", () => {
  highlightLayer.scrollTop = noteArea.scrollTop;
});

// Search button
searchBtn.addEventListener("click", () => {
  const term = searchInput.value.trim();
  updateHighlight(term);
});

// Clear search
clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  updateHighlight();
});

// ====================
// COUNTER
// ====================
function updateCounter() {
  const text = noteArea.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  const chars = text.length;
  wordCount.textContent = `Words: ${words}`;
  charCount.textContent = `Characters: ${chars}`;
}

// ====================
// STATUS MESSAGE
// ====================
function showStatus(message) {
  statusMsg.textContent = message;
  statusMsg.style.opacity = 1;
  setTimeout(() => { statusMsg.style.opacity = 0; }, 2000);
}
