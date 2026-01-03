function buildRagPrompt(contextDocs, userMessage, chatHistory = []) {
  const contextTexts = contextDocs.map((doc) => doc.content || doc);

  // Format chat history as conversation
  const historyText =
    chatHistory.length > 0
      ? chatHistory
          .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
          .join("\n")
      : "No previous conversation";

  return `
You are a customer support AI.
Use the context below AND the conversation history to answer.

Context from Knowledge Base:
${contextTexts.join("\n---\n")}

Previous Conversation:
${historyText}

Current User Question:
${userMessage}

Provide a helpful response considering the conversation context. If the answer is not in the context or history, say you don't know.
`;
}

module.exports = { buildRagPrompt };
