import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

// Ví dụ:
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const mint = new PublicKey("mntNPr2hDATxdWU2nsH1A4RTRozdUUVSHaQgiUW5gEu"); // Mint sẵn có FT Water
const payer = Keypair.fromSecretKey(
  Uint8Array.from(
    JSON.parse(
      require("fs").readFileSync("/Users/mbp/.config/solana/id.json").toString()
    )
  )
);
// Keypair (owner authority của mint)
const playerPublicKey = new PublicKey(
  "FG3zw7vkVRyTEiajSZkZMxGafjUShK7fL88vC4pkZewf"
); // public key player

// Tạo (hoặc lấy) ATA cho player:
const ata = await getOrCreateAssociatedTokenAccount(
  connection,
  payer, // payer phí tx
  mint, // mint của FT Water
  playerPublicKey // chủ tài khoản (player)
);

// console.log(ata);

// // Mint token vào ATA cho player:
// const sig = await mintTo(
//   connection,
//   payer, // payer
//   mint, // mint
//   ata.address, // account nhận token (player ATA)
//   payer, // mint authority (nên là chủ của mint)
//   10 // số lượng mint
// );

console.log("Minted! Tx:", sig);
