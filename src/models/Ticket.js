const { DataTypes } = require("sequelize");
const sequlize = require("../db/index");

const Ticket = sequlize.define("Ticket", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("open", "in_progress", "closed"),
    defaultValue: "open",
  },
});

module.exports = Ticket;
