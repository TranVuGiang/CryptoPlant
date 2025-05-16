const express = require("express");
const { fetchFT, useItem } = require("../controllers/ftController.js");
const { createPlayer } = require("../controllers/PlayerController.js");

const router = express.Router();

router.post("/create-player", async (req, res) => {
  const { playerName, playerWallet } = req.body;

  if (!playerWallet && !playerName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await createPlayer({
      playerName: playerName,
      walletPlayer: playerWallet,
    });

    res.json(result);
  } catch (error) {
    // LOG lỗi ra console
    console.error("Error in /createplayer:", error);
    // Trả lỗi chi tiết cho client
    res.status(500).json({ error: error.message || String(error) });
  }
});

module.exports = router;
