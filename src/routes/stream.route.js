const express = require("express");
const Redis = require("ioredis");

const router = express.Router();

router.get("/tickets/:id/stream", (req, res) => {
  const { id } = req.params;

  console.log(`📡 SSE connection opened for ticket ${id}`);

  // New Redis subscriber (do NOT reuse BullMQ connection)
  const sub = new Redis({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null,
  });

  let isCleanedUp = false;
  const channel = `ai-stream:${id}`;

  const cleanup = async () => {
    if (isCleanedUp) return;
    isCleanedUp = true;

    console.log(`🔌 Cleaning up SSE connection for ticket ${id}`);

    try {
      await sub.unsubscribe(channel);
      await sub.quit();
    } catch (err) {
      console.error("Cleanup error:", err.message);
    }

    if (!res.writableEnded) {
      res.end();
    }
  };

  // SSE headers with CORS support
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering

  // Send initial comment to establish connection
  res.write(": connected\n\n");
  res.flushHeaders();

  sub.subscribe(channel, (err) => {
    if (err) {
      console.error("Redis subscribe error:", err);
      cleanup();
      return;
    }
    console.log(`✅ Subscribed to ${channel}`);
  });

  sub.on("message", (ch, message) => {
    console.log(`📨 Received message on ${ch}:`, message);
    res.write(`data: ${message}\n\n`);

    // Check if streaming is done
    try {
      const data = JSON.parse(message);
      if (data.done) {
        console.log(`✅ Stream completed for ticket ${id}`);
        cleanup();
      }
    } catch (err) {
      console.error("Error parsing message:", err);
    }
  });

  sub.on("error", (err) => {
    console.error("Redis subscriber error:", err);
    cleanup();
  });

  // Cleanup on client disconnect
  req.on("close", () => {
    console.log(`❌ Client disconnected from ticket ${id}`);
    cleanup();
  });
});

module.exports = router;
