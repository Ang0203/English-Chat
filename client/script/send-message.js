import { getResourceString } from "./language";
import { showError, updateSendButton, appendMessage } from "./utils";

/**
 * Handle sending user input to server.
 *
 * @async
 * @param {HTMLElement} chatBox - The chat box element where messages are displayed.
 * @param {HTMLInputElement} userInput - The input field where the user types their message.
 * @param {HTMLElement} sendBtn - The send button to submit the message.
 * @param {HTMLElement} sendIcon - The icon inside the send button, which changes based on the input.
 */
export async function sendMessage(chatBox, userInput, sendBtn, sendIcon) {
    const userText = userInput.value.trim();

    // Input validation
    if (!userText) return;
    if (userText.length > 1000) {
        await showError("errorMessageLength");
        return;
    }

    // Retrieve chat history (last 5 messages) and send with the new message
    const history = getChatHistory(chatBox);

    // Append the message to chat box
    const processingMessage = await getResourceString("processingMessage");
    const inputPlaceholder = await getResourceString("inputPlaceholder");
    sendBtn.disabled = true;
    userInput.placeholder = processingMessage;
    userInput.value = "";
    appendMessage(userText, "user");    
    updateSendButton(userInput, sendIcon);
    appendMessage(processingMessage, "bot", true);

    // Call API and send the message to the server
    try {
        const response = await axios.post('/chat', { text: userText, history });

        if (chatBox.lastChild) chatBox.removeChild(chatBox.lastChild);
        sendBtn.disabled = false;
        userInput.placeholder = inputPlaceholder;
        appendMessage(response.data.reply, "bot");

    } catch (error) {
        if (chatBox.lastChild) chatBox.removeChild(chatBox.lastChild);
        sendBtn.disabled = false;
        userInput.placeholder = inputPlaceholder;

        // Check error from Express
        if (error.response) {
            console.error("[sendMessage] Server error:", error.response.data);
            await showError(error.response.data.error || "Unknown server error");
        } else {
            console.error("[sendMessage] Network error:", error.message);
            await showError("errorSendingMessage", error.message);
        }
    }
}

/**
 * Retrieves the last 5 messages from the chat box, 
 * expected order: user, bot, user, bot, user.
 * Returns a JSON string representing an array of { role, content } objects.
 * 
 * @param {HTMLElement} chatBox - The chat box element containing messages.
 * @returns {string} JSON string of the chat history.
 */
function getChatHistory(chatBox) {
    const messages = [];
    // Giả sử mỗi tin nhắn được bao bọc bởi một phần tử wrapper (ví dụ div với lớp 'd-flex')
    const children = Array.from(chatBox.children);
    // Lấy 5 tin nhắn cuối cùng (nếu có)
    const lastMessages = children.slice(-5);
    
    lastMessages.forEach(wrapper => {
        // Giả sử trong mỗi wrapper có một messageDiv chứa tin nhắn
        const messageDiv = wrapper.querySelector("div");
        if (messageDiv) {
            let role = "";
            // Dựa theo lớp CSS để xác định vai trò: nếu chứa "bg-custom-gray" thì là user, nếu "bg-white" thì là bot
            if (messageDiv.classList.contains("bg-custom-gray")) {
                role = "user";
            } else if (messageDiv.classList.contains("bg-white")) {
                role = "bot";
            } else {
                role = "unknown";
            }
            messages.push({ role, content: messageDiv.innerText.trim() });
        }
    });
    return JSON.stringify(messages);
}