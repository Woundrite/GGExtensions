// Event listener used to update the preview when the "markdown-content" textarea changes.
document.getElementById("markdown-content").addEventListener("input", () => {
  // Get references to the elements.
  const markdownContent = document.getElementById("markdown-content");
  const htmlPreview = document.getElementById("html-preview");

  // Convert Markdown to HTML.
  const htmlContent = marked.parse(markdownContent.value);

  // Sanitize the generated HTML and display it.
  htmlPreview.innerHTML = DOMPurify.sanitize(htmlContent, {
    USE_PROFILES: { html: true },
  });  
});

document.addEventListener("DOMContentLoaded", () => {
  let markdownInput = document.getElementById("markdown-content");
  let saveButton = document.getElementById("Save");

  chrome.storage.local.get(["Active"]).then((result) => {
    if (typeof result.Active === "number") {
      chrome.storage.local.get(["Notes"]).then((res) => {
        if (result.Active < Object.keys(res.Notes).length)
          markdownInput.value = res.Notes[result.Active];
      });
    }
  });

  document.getElementById("Close").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  saveButton.addEventListener("click", () => {
    let markdown = markdownInput.value;
    // Save the markdown to storage here
    chrome.storage.local.get(["Active"]).then((result) => {
      if (typeof result.Active === "number") {
        console.log("Found active markdown")
        chrome.storage.local.get(["Notes"]).then((res) => {
          let notes = res.Notes;
          notes[result.Active] = markdown;
          chrome.storage.local.set({ Notes: notes });
        });
      } else {
        co
        chrome.storage.local.set({ Notes: { 0: markdown } });
        chrome.storage.local.set({"Active": 0});
      }
    });
  });

});

document.getElementById("Change").onclick = () => {
  let md = document.getElementById("markdown-content");
  let hp = document.getElementById("html-preview");
  if (md.style.display == "none") {
    md.style.display = "block";
    hp.style.width = "400px";
  }
  else {
    md.style.display = "none";
    hp.style.width = "800px";
  }
};
