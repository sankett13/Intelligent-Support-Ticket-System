const express = require("express");
const redis = require("../redis/redisClient");

const router = express.Router();

router.get("/data", async (req, res) => {
  const cacheKey = "sample:data";

  //Check cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json({
      source: "cache",
      data: JSON.parse(cached),
    });
  }

  //Simulate slow DB / API
  await new Promise((r) => setTimeout(r, 3000));

  const data = {
    message: "This is slow data",
    time: new Date(),
  };

  //Save to Redis with TTL
  await redis.set(cacheKey, JSON.stringify(data), "EX", 30);

  res.json({
    source: "database",
    data,
  });
});

module.exports = router;
