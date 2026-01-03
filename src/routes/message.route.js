const express = require("express");
const { Message, Ticket } = require("../models");
const aiQueue = require("../queues/aiResponse.queue");

const router = express.Router();

//Get all tickets
router.get("/", async (req, res) => {
  const tickets = await Ticket.findAll({
    order: [["createdAt", "DESC"]],
  });
  res.json({ message: "Tickets retrieved successfully", data: tickets });
});

// Create a new ticket
router.post("/", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const ticket = await Ticket.create({ title });
  res.status(201).json({ message: "Ticket created", data: ticket });
});

// Send message to ticket
router.post("/:ticketId/messages", async (req, res) => {
  console.log("Received message request:", req.params, req.body);
  const { ticketId } = req.params;
  const { content } = req.body;

  // validate
  const ticket = await Ticket.findByPk(ticketId);
  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  //Save user message
  const userMessage = await Message.create({
    role: "user",
    content,
    TicketId: ticketId,
  });

  //Add AI job
  await aiQueue.add(
    "generate-ai-response",
    { ticketId },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
    }
  );

  //Respond immediately
  res.json({
    message: "Message received. AI is responding...",
    data: userMessage,
  });
});

// Get messages for a ticket
router.get("/:ticketId/messages", async (req, res) => {
  const { ticketId } = req.params;

  // Validate ticket exists
  const ticket = await Ticket.findByPk(ticketId);
  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  // Fetch all messages for the ticket
  const messages = await Message.findAll({
    where: { TicketId: ticketId },
    order: [["createdAt", "ASC"]],
  });

  res.json({
    message: "Messages retrieved successfully",
    data: messages,
  });
});

module.exports = router;
