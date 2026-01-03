const { Worker } = require("bullmq");
const Redis = require("ioredis");

const connection = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "email-queue",
  async (job) => {
    if (Math.random() < 0.5) {
      throw new Error("Random failure");
    }

    await new Promise((r) => setTimeout(r, 3000));
  },
  { connection, concurrency: 2 }
);

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed after ${job.attemptsMade} attempts`);
});
