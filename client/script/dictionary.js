export function setupDictionary() {
    const chatBox = document.getElementById("chatBox");
    
    chatBox.addEventListener("dblclick", (event) => {
      // Get the selected text by double clicking
      const selectedText = window.getSelection().toString().trim();
      if (selectedText) {
        // Create URL for Cambridge Dictionary
        const url = `https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(selectedText)}`;
        window.open(url, "_blank");
      }
    });
}