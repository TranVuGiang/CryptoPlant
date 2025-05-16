// controllers/ftController.js
require("dotenv").config();
const { connection } = require("../utils/connection.js");
const { loadFTMetadata } = require("../solana/loadFT.js");
const Item = require("../models/item.js");
const { PublicKey } = require("@solana/web3.js");
const anchor = require("@project-serum/anchor");
// Danh sách mint address FT cần load
const mintAddresses = [
  "EuF9wyqm72EzcS3WZL93wWrKwi66CYbNBGtqu1jzsEQV",
  "Bo1L5ZZ8u3HhCtBprsg6evkZ45f7NXNq7kwWnwPDdDTy",
  "D5CgBdE7sxd2a9iRibGeti6ponP2tHMA6suam2ogeMia",
  "33XifE1ouYtV6tesqUeTKTCaNjA7yJfo8kt2Y7YucGLi",
];
const {
  program,
  wallet,
  adminWallet,
} = require("../utils/anchorConnection.js");
const { getOrCreateAssociatedTokenAccount } = require("@solana/spl-token");
// Hàm load metadata cho tất cả mint address và trả về mảng FT
async function fetchFT() {
  try {
    const ftList = await Promise.all(
      mintAddresses.map(async (mint) => {
        const metadata = await loadFTMetadata(mint);

        if (metadata && metadata.uri) {
          try {
            const uriData = await fetch(metadata.uri);
            const metadataJson = await uriData.json();

            return new Item({
              name: metadataJson.name || metadata.name, // fallback nếu cần
              symbol: metadataJson.symbol || metadata.symbol,
              image: metadataJson.image || null,
              description: metadataJson.description || "",
              attributes: metadataJson.attributes || [],
            });
          } catch (err) {
            console.log(
              `Failed to fetch off-chain metadata for ${mint}:`,
              err.message
            );
            return null;
          }
        } else {
          console.log(`No metadata or uri found for: ${mint}`);
          return null;
        }
      })
    );

    // Lọc ra các FT load thành công
    const validFTs = ftList.filter((ft) => ft !== null);

    if (validFTs.length === 0) {
      throw new Error("No valid FT metadata found");
    }

    return validFTs; // Trả về mảng các FT đã load thành công
  } catch (error) {
    throw new Error(`Error loading FT: ${error.message}`);
  }
}

// Hàm dùng item để tăng điểm cho player
async function useItem({ playerWallet, itemMint, amount, xpBoostPercent }) {
  try {
    const playerPublicKey = new PublicKey(playerWallet);
    const itemMintPublicKey = new PublicKey(itemMint);

    // Tìm Associated Token Account (ATA) của player cho item
    // const ata = await anchor.utils.token.associatedAddress({
    //   mint: itemMintPublicKey,
    //   owner: playerPublicKey,
    // });

    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      adminWallet, // payer phí tx
      itemMintPublicKey, // mint của FT Water
      playerPublicKey // chủ tài khoản (player)
    );

    const [playerPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("player"),
        playerPublicKey.toBuffer(), // authority là publicKey của wallet hiện tại
      ],
      program.programId
    );

    console.log("Player ATA:", ata.toString());

    // Gọi method useItem trên Solana smart contract
    const tx = await program.methods
      .useItem(new anchor.BN(amount), new anchor.BN(xpBoostPercent))
      .accounts({
        player: playerPda,
        authority: playerPublicKey, // authority chính là playerWallet
        itemMint: itemMintPublicKey,
        playerItemAccount: ata.address, // ATA của player
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      })
      .instruction();

    console.log("Transaction signature:", tx);

    return {
      message: "Item used successfully!",
      txSignature: tx,
    };
  } catch (error) {
    console.error("Error using item:", error);
    throw new Error("Failed to use item");
  }
}

async function claimReward({ playerWallet }) {
  console.log("Claim reward for player wallet:", program.methods);
  try {
    const playerPublicKey = new PublicKey(playerWallet);

    const [playerPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("player"),
        playerPublicKey.toBuffer(), // authority là publicKey của wallet hiện tại
      ],
      program.programId
    );
    // Gọi method useItem trên Solana smart contract
    const tx = await program.methods
      .claimRewards()
      .accounts({
        player: playerPda,
      })
      .rpc();

    const playerAccount = await program.account.player.fetch(playerPda);

    const balance = playerAccount.balance.toNumber(); // balance -> number
    const createdAt = playerAccount.createdAt.toNumber(); // createdAt -> number

    // Gán lại giá trị vào playerAccount
    playerAccount.balance = balance;
    playerAccount.createdAt = createdAt;

    console.log("Player: ", playerAccount);
    console.log("Transaction signature:", tx);
    return {
      message: "Item used successfully!",
      playerAccount: playerAccount,
      txSignature: tx,
    };
  } catch (error) {
    console.error("Error using item:", error);
    throw new Error("Failed to use item");
  }
}

module.exports = { fetchFT, useItem, claimReward };
