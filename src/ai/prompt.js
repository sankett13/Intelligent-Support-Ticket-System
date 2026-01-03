const { ChatPromptTemplate } = require("@langchain/core/prompts");

const chatPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an AI assistant for a customer support system. Provide helpful and concise responses to user inquiries based on the context of their support tickets. Consider the conversation history to provide contextually relevant responses.`,
  ],
  ["placeholder", "{chatHistory}"],
]);

module.exports = { chatPrompt };
