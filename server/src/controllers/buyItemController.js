const { connection } = require("../utils/connection.js");
const {
  getOrCreateAssociatedTokenAccount,
  mintTo,
} = require("@solana/spl-token");
const { PublicKey, Keypair } = require("@solana/web3.js");
require("dotenv").config();
// const adminWallet = Keypair.fromSecretKey(
//   Uint8Array.from(
//     JSON.parse(
//       require("fs").readFileSync("/Users/mbp/.config/solana/id.json").toString()
//     )
//   )
// );
const {
  program,
  adminWallet,
  wallet,
} = require("../utils/anchorConnection.js");

const anchor = require("@project-serum/anchor");

async function mintToPlayer({
  mintAddress,
  playerWallet,
  amount,
  price_per_item,
}) {
  console.log("Chương trình Cryptoplant có methods là:", program.methods);

  const mintPublicKey = new PublicKey(mintAddress);
  const playerPublicKey = new PublicKey(playerWallet);
  const mintAmount = amount || 1; // Số lượng mint, mặc định là 1

  const ata = await getOrCreateAssociatedTokenAccount(
    connection,
    adminWallet, // payer phí tx
    mintPublicKey, // mint của FT Water
    playerPublicKey // chủ tài khoản (player)
  );

  const [playerPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("player"),
      playerPublicKey.toBuffer(), // authority là publicKey của wallet hiện tại
    ],
    program.programId
  );

  // console.log("ATA:", ata.address.toString());
  // console.log("ATA info:", ata);

  console.log("Payer:", playerPda);

  // Mint token vào ATA cho player:

  try {
    await mintTo(
      connection,
      adminWallet, // payer
      mintPublicKey, // mint
      ata.address, // account nhận token (player ATA)
      adminWallet.publicKey, // mint authority (nên là chủ của mint)
      mintAmount // số lượng mint
    );
    await program.methods
      .buyItem(new anchor.BN(amount), new anchor.BN(price_per_item)) // hoặc chỉ amount nếu bạn code không dùng BN
      .accounts({
        player: playerPda,
      })
      .signers([wallet.payer])
      .rpc();
  } catch (error) {
    console.log("Error minting token:", error);
    throw new Error("Minting failed", error);
  }

  // 2. Fetch lại thông tin Player account sau khi mua xong
  const playerAccount = await program.account.player.fetch(playerPda);

  console.log("Player account after minting:", playerAccount);

  return {
    message: "Minting successful",
    status: true,
  };
}

module.exports = { mintToPlayer };
