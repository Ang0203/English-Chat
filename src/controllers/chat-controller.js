import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
});
const chatController = {};

/**
 * Handle incoming chat messages and calls OpenAI's createChatCompletion endpoint
 * using the gpt-4o-mini model to generate a reply in English.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
chatController.chat = async (req, res, next) => {
  try {
    const { text, history } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "[Chat]: Empty message provided." });
    }
  
    // Call API
    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [
        { role: "system", content: "{{ - You are an intelligent English tutor. }}" },
        { role: "system", content: "{{ - Always respond in English and help improve the user's language skills. }}" },
        { role: "system", content: "{{ - Get to the point and act professional, no using emoji or markdown, just plaintext. Also do not use thought or note sentences. }}" },
        { role: "system", content: `{{ - Here is the chat history if available for more context: ${history} }}`},
        { role: "user", content: text }
      ],
      temperature: 0.2,
      frequency_penalty: 1.0,
      presence_penalty: 1.0,
      repetition_penalty: 1.0,
      route: "fallback"
    })

    // Return reply
    const reply = completion.choices[0].message.content;
    res.status(200).json({
      reply: reply
    });
  } catch (error) {
    console.error("[chatController.chat] Error:", error);

    // Check if error is from API
    if (error.response) {
      return res.status(error.response.status).json({
        error: "API error",
        details: error.response.data
      });
    }

    // Unknown error
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

export { chatController };