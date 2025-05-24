import { showError } from "./utils.js";

let RESOURCES = {};
let LANG = "";

/**
 * Returns the localized string by key. Falls back to key if not found.
 * @param {string} key
 * @returns {Promise<string>}
 */
export async function getResourceString(key) {
  if (!Object.keys(RESOURCES).length) {
    await loadLanguageResources();
  }
  return RESOURCES[LANG]?.[key] || key;
}

/**
 * Setup language dropdown and apply saved or default language.
 * @returns {Promise<void>}
 */
export async function setupLanguage() {
  await loadLanguageResources();
  populateLanguageDropdown(document.getElementById("languageDropdown"));
}

/**
 * Loads language resources from cache or network.
 * Sets RESOURCES and LANG.
 */
async function loadLanguageResources() {
  try {
    const now = Date.now();
    const cacheTime = 24 * 60 * 60 * 1000; // 1 day
    const lastFetched = Number(localStorage.getItem("resources_timestamp"));
    const cachedResources = localStorage.getItem("resources");
    const cachedLang = localStorage.getItem("lang");

    if (cachedResources && lastFetched && (now - lastFetched < cacheTime)) {
      RESOURCES = JSON.parse(cachedResources);
      LANG = resolveLanguage(cachedLang);
      applyLanguageToDOM();
      return;
    }

    const res = await fetch("/resources.json");
    RESOURCES = await res.json();
    LANG = resolveLanguage(cachedLang);

    localStorage.setItem("resources", JSON.stringify(RESOURCES));
    localStorage.setItem("resources_timestamp", now.toString());
    localStorage.setItem("lang", LANG);

    applyLanguageToDOM();
  } catch (err) {
    await showError("errorLoadingResources", err.message);
  }
}

/**
 * Applies the currently selected language to relevant UI elements.
 */
function applyLanguageToDOM() {
  if (!RESOURCES[LANG]) return;

  const dict = RESOURCES[LANG];
  document.title = dict["chatTitle"] || "22810201";

  const mappings = {
    clearChatBtn: "title",
    chatTitle: "innerText",
    userInput: "placeholder",
    languageText: "innerText"
  };

  for (const [id, prop] of Object.entries(mappings)) {
    const el = document.getElementById(id);
    if (el && dict[id]) el[prop] = dict[id];
  }
}

/**
 * Populates the language selection dropdown.
 * @param {HTMLElement} dropdown
 */
function populateLanguageDropdown(dropdown) {
  dropdown.innerHTML = "";

  Object.keys(RESOURCES).forEach((langCode) => {
    const label = RESOURCES[langCode]?.language || langCode;
    const link = document.createElement("a");
    link.className = `dropdown-item${langCode === LANG ? " active" : ""}`;
    link.href = "#";
    link.innerText = label;

    link.addEventListener("click", async (e) => {
      e.preventDefault();
      localStorage.setItem("lang", langCode);
      await loadLanguageResources();
      updateDropdownActiveState(dropdown, langCode);
    });

    const li = document.createElement("li");
    li.appendChild(link);
    dropdown.appendChild(li);
  });
}

/**
 * Updates the active class in the dropdown menu.
 * @param {HTMLElement} dropdown
 * @param {string} activeLang
 */
function updateDropdownActiveState(dropdown, activeLang) {
  Array.from(dropdown.querySelectorAll("a")).forEach((a) =>
    a.classList.toggle("active", a.innerText === RESOURCES[activeLang]?.language)
  );
}

/**
 * Returns a valid language code. Defaults to "vi" if not found.
 * @param {string} lang
 * @returns {string}
 */
function resolveLanguage(lang) {
  return RESOURCES[lang] ? lang : "vi";
}
