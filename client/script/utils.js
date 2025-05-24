import { getResourceString } from "./language.js";
import { createAudioButton } from "./audio.js";
import { marked } from "marked";
import DOMPurify from "dompurify";

/**
 * Display an error message in a Bootstrap toast notification.
 * 
 * @async
 * @param {string} message - The error message that will be displayed in the toast.
 * @param {string} [payload=""] - The additional error message that will be displayed in the toast.
 * @param {number} [delay=0] - The delay (in milliseconds) after which the toast will automatically hide. Default is 0 (no auto-hide).
 */
export async function showError(message, payload = "", delay = 0) {
    const errorMessage = await getResourceString(message) || message;
    const fullMessage = `${errorMessage}: ${payload}`;

    // Check if the #errorText element exists
    const errorTextElement = document.getElementById("errorText");
    if (!errorTextElement) {
        alert("Error: The #errorText element is missing from the DOM!");
        return;
    }
    errorTextElement.innerText = fullMessage;

    // Check if the #errorToast element exists
    const toastElement = document.getElementById("errorToast");
    if (!toastElement) {
        alert("Error: The #errorToast element is missing from the DOM!");
        return;
    }

    // Initialize and show the Toast
    new bootstrap.Toast(toastElement, { 
        autohide: delay > 0, 
        delay: delay 
    }).show();
}

/**
 * Update the Send Button based on the user input.
 * 
 * @param {HTMLInputElement} userInput - The input field where the user types their message.
 * @param {HTMLElement} sendIcon - The icon inside the send button, which changes based on the input.
 */
export function updateSendButton(userInput, sendIcon) {
    if (userInput.value.trim()) {
        sendIcon.classList.replace("bi-mic", "bi-arrow-up");
    } else {
        sendIcon.classList.replace("bi-arrow-up", "bi-mic");
    }
}

/**
 * Append a message to the chat box.
 * 
 * @param {string} text - The text of the message to be appended.
 * @param {string} sender - The sender of the message, either "user" or "bot".
 * @param {boolean} [processing=false] - The indicator if the message is a processing announcement. Default is false.
 */
export function appendMessage(text, sender, processing = false) {
    const wrapperDiv = createMessageWrapper(sender);
    const messageDiv = createMessageBubble(text, sender, processing);

    // Add an audio button if the message is not a processing announcement
    if (!processing) {
        const audioBtn = createAudioButton(text);
        messageDiv.appendChild(audioBtn);     
    }
     
    wrapperDiv.appendChild(messageDiv);
    chatBox.appendChild(wrapperDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Create the wrapper div for a message.
 * 
 * @param {string} sender - The sender of the message, either "user" or "bot".
 * @returns {HTMLElement} The wrapper div element for the message.
 */
function createMessageWrapper(sender) {
    const wrapperDiv = document.createElement("div");
    wrapperDiv.classList.add("d-flex", sender === "user" ? "justify-content-end" : "justify-content-start");
    
    return wrapperDiv;
}

/**
 * Create the message div element for displaying the text.
 * 
 * @param {string} text - The text content of the message.
 * @param {string} sender - The sender of the message, either "user" or "bot".
 * @returns {HTMLElement} The message div element containing the text.
 */
function createMessageBubble(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("p-2", "rounded", "mb-2", "w-auto", "d-inline-block");

    if (sender === "user") {
        messageDiv.classList.add("bg-custom-gray", "text-dark");
    } else {
        messageDiv.classList.add("bg-white", "border", "border-dark", "text-dark");
    }

    // Parse Markdown and sanitize HTML
    const html = DOMPurify.sanitize(marked.parse(text));

    // Add content using innerHTML (to support Markdown)
    const textSpan = document.createElement("span");
    textSpan.innerHTML = html;
    messageDiv.appendChild(textSpan);

    return messageDiv;
}