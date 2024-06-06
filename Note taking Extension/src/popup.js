document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["Notes"]).then((result) => {
    if (notes) {
      console.log(result.Notes);
      document
        .getElementsByClassName("new")[0]
        .addEventListener("click", () => {
          chrome.storage.local.set({ Active: Object.keys(result.Notes).length });
          window.location.href = "Editor.html";
        });

      (async (notes) => {
        let str = "";
        for (let ind in notes) {
          console.log(notes[ind]);
          str = `<div class="notetitle"><b>${notes[ind]}</b></div><button class="edit" data-edit-index="${ind}">&#9998;</button><button class="del" data-del-index="${ind}">&#10006;</button>`;
          let elem = document.createElement("div");
          elem.innerHTML = str;
          document.getElementById("notes").appendChild(elem);
        }

        Array.from(document.getElementsByClassName("edit")).forEach((elem) => {
          elem.addEventListener("click", (e) => {
            chrome.storage.local.set({ Active: Number(e.target.dataset.editIndex) });
            window.location.href = "Editor.html";
          });
        });
        
        Array.from(document.getElementsByClassName("del")).forEach((elem) => {
          elem.addEventListener("click", (e) => {
            let ind = Number(e.target.dataset.delIndex);
            chrome.storage.local.get("Notes").then((result) => {
              let notes = result.Notes;
              delete notes[ind];
              chrome.storage.local.set({ Notes: notes });
              window.location.reload();
            });
          });
        });

        
      })(result.Notes);
    } else {
      console.log("hoola");
      document
        .getElementsByClassName("new")[0]
        .addEventListener("click", () => {
          chrome.storage.local.set({ Active: 0 });
          window.location.href = "Editor.html";
        });
    }
  });
});
