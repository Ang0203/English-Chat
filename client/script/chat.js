import { updateSendButton } from "./utils.js";
import { getResourceString } from "./language.js";
import { sendMessage } from "./send-message.js";
import { startRecording, stopRecording, isVoiceRecording } from "./recording.js";

/**
 * Initializes the chat functionality, including event listeners for sending messages, 
 * clearing the chat, and handling voice recording.
 */
export function setupChat() {
    const clearChatBtn = document.getElementById("clearChatBtn");
    const chatBox = document.getElementById("chatBox");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const sendIcon = document.getElementById("sendIcon");

    // Ensure sendButton is enabled
    if (sendBtn.disabled) {
        sendBtn.disabled = false;
    }

    // Function to handle input and decide whether to send message or start/stop recording
    const handleInput = () => {
        // If the user input is not empty, send the message
        if (userInput.value.trim()) {
            sendMessage(chatBox, userInput, sendBtn, sendIcon);
        } else {
            // If there's no input, check if voice recording is active or not
            if (!isVoiceRecording()) {
                // If voice recording is not active, start recording
                startRecording(userInput, sendIcon);
            } else {
                // If voice recording is active, stop recording
                stopRecording();
            }
        }
    };

    // Event listener to clear the chat after user confirmation.
    clearChatBtn.addEventListener("click", async () => {
        if (confirm(await getResourceString("confirmClearChat"))) {
            chatBox.innerHTML = "";
        }
    });

    // Event listener for the send button click
    sendBtn.addEventListener("click", handleInput);

    // Event listener for the Enter key press in the user input field
    userInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && sendBtn.disabled == false) {
            handleInput();
        }
    });

    // Event listener to update the send button UI when the user types
    userInput.addEventListener("input", () => updateSendButton(userInput, sendIcon));
}
