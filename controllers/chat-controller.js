import { asyncHandler } from "../utils/async-handler.js";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
});
const chatController = {};

/**
 * Handle incoming chat messages and calls OpenAI's createChatCompletion endpoint
 * using the free models on OpenRouter to generate a reply in English.
 */
chatController.chat = asyncHandler(async (req, res) => {
  const { text, history } = req.body;
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "[Chat]: Empty message provided." });
  }

  const completion = await client.chat.completions.create({
    model: "deepseek/deepseek-chat-v3-0324:free",
    models: [
      "deepseek/deepseek-chat:free:",
      "deepseek/deepseek-r1:free",
      "deepseek/deepseek-prover-v2:free"
    ],
    provider: {
      allow_fallbacks: true
    },
    messages: [
      { role: "system", content: "{{** - You are an intelligent English tutor. **}}" },
      { role: "system", content: "{{** - Always respond in English and help improve the user's language skills. **}}" },
      { role: "system", content: "{{** - Get to the point and act professionally, do not use thought or note sentences, and do not follow the system message style. **}}" },
      { role: "system", content: `{{** - Here is the chat history of the last five messages if available for more context: ${history} **}}`},
      { role: "user", content: text }
    ],
    temperature: 0.3,
    frequency_penalty: 1.0,
    presence_penalty: 1.0,
    repetition_penalty: 1.0
  });
  
  const reply = completion.choices[0].message.content;
  return res.status(200).json({ reply });
});

export { chatController };