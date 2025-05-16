const { Connection, clusterApiUrl, PublicKey } = require("@solana/web3.js");
const { Metaplex } = require("@metaplex-foundation/js");
const { connection, metaplex } = require("../utils/connection.js");

// Thiết lập kết nối với Solana
// const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// // Khởi tạo Metaplex instance
// const metaplex = new Metaplex(connection);

// Hàm lấy metadata của token từ MintAddress (MintPublicKey)
async function loadFTMetadata(mintAddress) {
  try {
    const mintPublicKey = new PublicKey(mintAddress);
    // Lấy thông tin Metadata account
    const onchainMetadata = await metaplex
      .nfts()
      .findByMint({ mintAddress: mintPublicKey });

    // Lấy thông tin off-chain (json metadata nếu có)
    let offchainData = {};
    if (onchainMetadata.uri) {
      // Gọi lấy json metadata (không phải token nào cũng có metadata uri)
      try {
        const resp = await fetch(onchainMetadata.uri);
        offchainData = await resp.json();
      } catch (_) {
        offchainData = {};
      }
    }

    return {
      mint: mintAddress,
      name: onchainMetadata.name,
      symbol: onchainMetadata.symbol,
      uri: onchainMetadata.uri,
      offchain: offchainData,
    };
  } catch (error) {
    console.error("Error loading FT metadata:", error.message);
    return null;
  }
}

module.exports = { loadFTMetadata };
