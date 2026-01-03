const sequelize = require("../db/index");
const Ticket = require("./Ticket");
const Message = require("./Message");

//Relationships
Ticket.hasMany(Message, { onDelete: "CASCADE" });
Message.belongsTo(Ticket);

module.exports = {
  sequelize,
  Ticket,
  Message,
};
