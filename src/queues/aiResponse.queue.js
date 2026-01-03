const { Queue } = require("bullmq");
const Redis = require("ioredis");

const connection = new Redis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
});

const aiResponseQueue = new Queue("ai-response-queue", { connection });

module.exports = aiResponseQueue;
