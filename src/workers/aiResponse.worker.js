require("dotenv").config();
const { Worker } = require("bullmq");
const Redis = require("ioredis");
const { Message } = require("../models");

const { llm } = require("../ai/llm");
const { retrieveRelevantDocuments } = require("../ai/retriever");
const { buildRagPrompt } = require("../ai/ragPrompt");

// Redis connection for BullMQ
const connection = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "ai-response-queue",
  async (job) => {
    const { ticketId } = job.data;

    console.log("🤖 RAG + Gemini (streaming) handling ticket:", ticketId);

    try {
      // 1️⃣ Fetch conversation
      const messages = await Message.findAll({
        where: { TicketId: ticketId },
        order: [["createdAt", "ASC"]],
      });

      if (!messages.length) {
        console.log("⚠️ No messages found for ticket", ticketId);
        return;
      }

      // 2️⃣ Get last user message
      const lastUserMessage = messages
        .filter((m) => m.role === "user")
        .slice(-1)[0]?.content;

      if (!lastUserMessage) {
        console.log("⚠️ No user message found for ticket", ticketId);
        return;
      }

      // 3️⃣ Build chat history (exclude last user message)
      const previousMessages = messages.slice(0, -1);

      // 4️⃣ Retrieve relevant KB docs
      console.log("🔍 Retrieving relevant documents...");
      const contextDocs = await retrieveRelevantDocuments(lastUserMessage, 3);
      console.log(`📚 Found ${contextDocs.length} relevant documents`);

      // 5️⃣ Build RAG prompt
      const prompt = buildRagPrompt(
        contextDocs,
        lastUserMessage,
        previousMessages
      );

      // 6️⃣ Generate AI response
      console.log(`🤖 Generating AI response for ticket ${ticketId}`);
      const response = await llm.invoke(prompt);
      const finalAnswer = response.content;

      console.log(`✅ AI response generated for ticket ${ticketId}`);

      // 7️⃣ Save final AI message
      await Message.create({
        role: "ai",
        content: finalAnswer,
        TicketId: ticketId,
      });

      console.log("✅ AI streaming response saved");
    } catch (error) {
      console.error(`❌ Error processing ticket ${ticketId}:`, error);
      throw error; // Re-throw to mark job as failed
    }
  },
  {
    connection,
    concurrency: 2,
  }
);

worker.on("completed", (job) => {
  console.log(`🎉 AI job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error("❌ AI job failed:", err.message);
});
