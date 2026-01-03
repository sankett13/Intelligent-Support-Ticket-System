const sequelize = require("../db");

async function retrieveRelevantDocuments(query, topK = 5) {
  try {
    const { embeddings } = require("./embeddings");
    const queryEmbedding = await embeddings.embedQuery(query);

    const KnowledgeBase = require("../models/knowledgebase");
    const allEntries = await KnowledgeBase.findAll();

    const computeCosineSimilarity = (vecA, vecB) => {
      const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
      const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
      const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
      return dotProduct / (magnitudeA * magnitudeB);
    };

    const scoredEntries = allEntries.map((entry) => {
      const entryEmbedding = entry.embedding;
      const score = computeCosineSimilarity(queryEmbedding, entryEmbedding);
      return { entry, score };
    });

    scoredEntries.sort((a, b) => b.score - a.score);

    const topEntries = scoredEntries.slice(0, topK).map((item) => item.entry);

    return topEntries;
  } catch (error) {
    console.error("❌ Error:", error.message);
    return [];
  }
}

module.exports = { retrieveRelevantDocuments };
