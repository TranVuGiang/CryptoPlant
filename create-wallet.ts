// scripts/create-wallet.ts
import fs from "fs";
import { Keypair } from "@solana/web3.js";

const kp = Keypair.generate();
fs.writeFileSync("wallet.json", JSON.stringify(Array.from(kp.secretKey)));

console.log("✅ Ví mới đã được tạo!");
console.log("Public Key:", kp.publicKey.toBase58());