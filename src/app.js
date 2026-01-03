const express = require("express");
const testRoute = require("./routes/test.route");
const redis = require("./redis/redisClient");
const jobRoute = require("./routes/job.route");
const { sequelize } = require("./models");
const messageRoute = require("./routes/message.route");
const streamRoutes = require("./routes/stream.route");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = 3000;

(async () => {
  await sequelize.sync({ alter: true });
  console.log("Database synchronized");
})();

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(express.json());

app.use("/test", testRoute);
app.use("/jobs", jobRoute);
app.use("/tickets", messageRoute);
// app.use("/stream", streamRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
