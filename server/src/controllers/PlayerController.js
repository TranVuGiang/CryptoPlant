require("dotenv").config();
const { PublicKey } = require("@solana/web3.js");
const anchor = require("@project-serum/anchor");
const {
  program,
  adminWallet,
  wallet,
} = require("../utils/anchorConnection.js");

const authority = wallet.payer;

async function createPlayer({ playerName, walletPlayer }) {
  console.log("Player name:", playerName);
  console.log("Player wallet:", walletPlayer);

  const name = playerName || "Player";
  const playerWallet = new PublicKey(walletPlayer);

  const [playerPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("player"),
      playerWallet.toBuffer(), // authority là publicKey của wallet hiện tại
    ],
    program.programId
  );

  try {
    await program.methods
      .createPlayer(name)
      .accounts({
        admin: authority.publicKey, // 👈 admin ký
        player: playerPda, // 👈 PDA
        authority: playerWallet, // 👈 publicKey của player
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([wallet.payer]) // 👈 signer là admin ví
      .rpc();

    const playerAccount = await program.account.player.fetch(playerPda);
    console.log("Player: ", playerAccount);

    // Chuyển đổi balance và createdAt từ BN sang số thực
    const balance = playerAccount.balance.toNumber(); // balance -> number
    const createdAt = playerAccount.createdAt.toNumber(); // createdAt -> number

    // Gán lại giá trị vào playerAccount
    playerAccount.balance = balance;
    playerAccount.createdAt = createdAt;

    console.log("Player: ", playerAccount);

    return {
      message: "Player created successfully",
      player: playerAccount,
    };
  } catch (error) {
    console.error("Error creating player:", error);
    throw new Error("Failed to create player");
  }
}

// Trả về thông tin player

module.exports = { createPlayer };
