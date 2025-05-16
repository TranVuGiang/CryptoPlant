// routes/ftRoutes.js
const express = require("express");
const {
  fetchFT,
  useItem,
  claimReward,
} = require("../controllers/ftController.js");
const { mintToPlayer } = require("../controllers/buyItemController.js");

const router = express.Router();

// Endpoint để load FT từ Solana
router.get("/load-ft/", async (req, res) => {
  try {
    const item = await fetchFT();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/buy-item", async (req, res) => {
  const { mintAddress, playerWallet, amount, price_per_item } = req.body;

  if (!mintAddress || !playerWallet) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await mintToPlayer({
      mintAddress,
      playerWallet,
      amount,
      price_per_item,
    });
    res.json(result);
  } catch (error) {
    // LOG lỗi ra console
    console.error("Error in /buy-item:", error);
    // Trả lỗi chi tiết cho client
    res.status(500).json({ error: error.message || String(error) });
  }
});
// Endpoint để dùng item và tăng điểm cho player
router.post("/use-item", (req, res) => {
  const { itemMint, playerWallet, amount, xpBoostPercent } = req.body;
  if (!itemMint || !playerWallet) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const result = useItem({
      playerWallet,
      itemMint,
      amount,
      xpBoostPercent,
    });
    res.json(result);
  } catch (error) {
    console.error("Error in /use-item:", error);
    res.status(500).json({ error: error.message });
  }
});

// Claim Reward
router.post("/claim-reward", async (req, res) => {
  const { playerWallet } = req.body;
  if (!playerWallet) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const result = await claimReward({
      playerWallet,
    });
    res.json(result);
  } catch (error) {
    console.error("Error in /claim-reward:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
