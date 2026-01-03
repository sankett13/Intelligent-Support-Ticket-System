const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("ai_support_system", "ai_user", "admin123", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

module.exports = sequelize;
