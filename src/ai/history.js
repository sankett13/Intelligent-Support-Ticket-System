const {
  HumanMessage,
  AIMessage,
  SystemMessage,
} = require("@langchain/core/messages");

function buildChatHistory(messages) {
  return messages.map((msg) => {
    return msg.role === "user"
      ? new HumanMessage(msg.content)
      : new AIMessage(msg.content);
  });
}

module.exports = { buildChatHistory };
