const express = require("express");
const ftRoutes = require("./src/routes/ftRoutes");
const playerRoutes = require("./src/routes/playerRoutes");

const app = express();
const PORT = 1409;
require("dotenv").config();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

app.use("/api/player", playerRoutes);
app.use("/api/item", ftRoutes);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
