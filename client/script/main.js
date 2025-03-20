import { setupLanguage } from "./language.js";
import { setupChat } from "./chat.js";
import { setupDictionary } from "./dictionary.js";

document.addEventListener("DOMContentLoaded", async () => {
    await setupLanguage();
    setupChat();
    setupDictionary();
    console.log("[INFO] Client script loaded!");
});