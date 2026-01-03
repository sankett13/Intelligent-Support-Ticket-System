const express = require("express");
const emailQueue = require("../queues/email.queue");

const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { to, subject, body } = req.body;

  try {
    await emailQueue.add("sendEmail", { to, subject, body },{attempts:3, backoff:{type:'exponential',delay:2000}, priority: 1});
    res.status(200).send({ message: "Email job added to the queue" });
  } catch (error) {
    res.status(500).send({ error: "Failed to add email job to the queue" });
  }
});

module.exports = router;
