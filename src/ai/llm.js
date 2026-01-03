const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const llm = new ChatGoogleGenerativeAI({
  temperature: 0.7,
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

module.exports = { llm };
