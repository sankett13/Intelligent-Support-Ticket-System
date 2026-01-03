require("dotenv").config();

const KnowledgeBase = require("../models/knowledgebase");
const sequelize = require("../db");

async function checkEmbeddings() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully\n");

    const entries = await KnowledgeBase.findAll();

    console.log(`📊 Total entries in KnowledgeBase: ${entries.length}\n`);

    if (entries.length === 0) {
      console.log("⚠️  No entries found in the database");
    } else {
      entries.forEach((entry, index) => {
        console.log(`\n--- Entry ${index + 1} ---`);
        console.log(`ID: ${entry.id}`);
        console.log(`Content: ${entry.content}`);

        // Handle both string and array embeddings
        let embeddingInfo = "null";
        if (entry.embedding) {
          try {
            const embeddingArray =
              typeof entry.embedding === "string"
                ? JSON.parse(entry.embedding)
                : entry.embedding;
            embeddingInfo = `Array of ${embeddingArray.length} dimensions`;
          } catch (e) {
            embeddingInfo = `Present (parse error: ${e.message})`;
          }
        }
        console.log(`Embedding: ${embeddingInfo}`);
        console.log(`Created: ${entry.createdAt}`);
      });
    }

    await sequelize.close();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkEmbeddings();
