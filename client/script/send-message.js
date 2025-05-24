import { showError, updateSendButton, appendMessage } from "./utils";
import { getResourceString } from "./language";

/**
 * Handle sending user input to server.
 *
 * @async
 * @param {HTMLElement} chatBox - The chat box element where messages are displayed.
 * @param {HTMLInputElement} input - The input field where the user types their message.
 * @param {HTMLElement} button - The send button to submit the message.
 * @param {HTMLElement} icon - The icon inside the send button, which changes based on the input.
 */
export async function sendMessage(chatBox, input, button, icon) {
    const userText = input.value.trim();
    if (!userText) return;
    if (userText.length > 1000) {
        return await showError("errorMessageLength");
    };

    const history = getChatHistory(chatBox);
    const [processingMessage, inputPlaceholder] = await Promise.all([
        getResourceString("processingMessage"),
        getResourceString("inputPlaceholder"),
    ]);
    
    // Update UI and send message for user
    setSendingState(true, input, button, icon, processingMessage);
    appendMessage(userText, "user");
    appendMessage(processingMessage, "bot", true);

    // Call API and send the message to the server
    try {
        const res = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: userText, history })
        });

        const { reply, error, message } = await res.json();
        chatBox.lastChild?.remove();
        if (!res.ok) {
            return await showError(error, message);
        }

        appendMessage(reply, "bot");
    } catch (err) {
        await showError("errorSendingMessage", err.message);
    } finally {
        chatBox.lastChild?.remove();
        setSendingState(false, input, button, icon, inputPlaceholder);
    }
}

/**
 * Retrieves the last 10 messages from the chat box.
 * Returns a JSON string representing an array of { role, content } objects.
 * 
 * @param {HTMLElement} chatBox - The chat box element containing messages.
 * @returns {string} JSON string of the chat history.
 */
function getChatHistory(chatBox) {
    const children = Array.from(chatBox.children);
    const lastMessages = children.slice(-10);
    
    return JSON.stringify(lastMessages.map(wrapper => {
        const messageDiv = wrapper.querySelector("div");
        if (!messageDiv) return { role: "unknown", content: "" };

        const role = messageDiv.classList.contains("bg-custom-gray")
            ? "user"
            : messageDiv.classList.contains("bg-white")
                ? "bot"
                : "unknown";

        return { role, content: messageDiv.innerText.trim() };
    }));
}

/**
 * Set the UI state for when sending or restoring message input.
 *
 * @param {boolean} isSending - Indicates whether a message is currently being sent (true) or not (false).
 * @param {HTMLInputElement} input - The input field where the user types their message.
 * @param {HTMLElement} button - The send button element to enable/disable based on sending state.
 * @param {HTMLElement} icon - The icon inside the send button, which can be updated to reflect the state.
 * @param {string} placeholder - The placeholder text to display in the input field.
 */
function setSendingState(isSending, input, button, icon, placeholder) {
    button.disabled = isSending;
    input.placeholder = placeholder;
    if (isSending) {
        input.value = "";
    }
    updateSendButton(input, icon);
}