const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const KnowledgeBase = sequelize.define("KnowledgeBase", {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  embedding: {
    type: DataTypes.TEXT, // Store as JSON string, or use 'vector(768)' if pgvector is installed
    get() {
      const rawValue = this.getDataValue("embedding");
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
      this.setDataValue("embedding", value ? JSON.stringify(value) : null);
    },
  },
});

module.exports = KnowledgeBase;
