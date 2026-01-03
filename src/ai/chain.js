const { RunnableSequence } = require("@langchain/core/runnables");
const { chatPrompt } = require("./prompt");
const { llm } = require("./llm");

const chain = RunnableSequence.from([chatPrompt, llm]);

module.exports = { chain };
