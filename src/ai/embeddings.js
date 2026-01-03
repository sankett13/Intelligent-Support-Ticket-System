const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");

// Use 'text-embedding-004' for the latest version
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

module.exports = { embeddings };
