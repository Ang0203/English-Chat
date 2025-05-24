import { updateSendButton } from "./utils.js";
import { getResourceString } from "./language.js";
import { sendMessage } from "./send-message.js";
import { startRecording, stopRecording, isVoiceRecording } from "./recording.js";

/**
 * Initializes the chat functionality: sending, clearing chat, and voice recording.
 */
export function setupChat() {
  const clearChatBtn = document.getElementById("clearChatBtn");
  const chatBox = document.getElementById("chatBox");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const sendIcon = document.getElementById("sendIcon");

  sendBtn.disabled = false;

  userInput.addEventListener("input", () => updateSendButton(userInput, sendIcon));
  userInput.addEventListener("keydown", handleEnterKey);
  sendBtn.addEventListener("click", handleUserAction);
  clearChatBtn.addEventListener("click", handleClearChat);

  /**
   * Handles sending message or toggling voice recording based on input content.
   */
  function handleUserAction() {
    if (userInput.value.trim()) {
      sendMessage(chatBox, userInput, sendBtn, sendIcon);
      return;
    }

    if (isVoiceRecording()) {
      stopRecording();
    } else {
      startRecording(userInput, sendIcon);
    }
  }

  /**
   * Handles Enter key to trigger user action.
   */
  function handleEnterKey(event) {
    if (event.key === "Enter" && !sendBtn.disabled) {
      handleUserAction();
    }
  }

  /**
   * Clears the chat box after confirmation.
   */
  async function handleClearChat() {
    const confirmClear = await getResourceString("confirmClearChat");
    if (confirm(confirmClear)) {
      chatBox.innerHTML = "";
    }
  }
}
