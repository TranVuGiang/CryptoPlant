import { clusterApiUrl } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const { Token, TOKEN_PROGRAM_ID } = require("@solana/spl-token");

// Khởi tạo kết nối và các keypair
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const wallet = anchor.Wallet.local();
const payer = wallet.payer;
const playerPublicKey = new PublicKey(
  "FG3zw7vkVRyTEiajSZkZMxGafjUShK7fL88vC4pkZewf"
);
const itemTokenMint = new PublicKey(
  "EuF9wyqm72EzcS3WZL93wWrKwi66CYbNBGtqu1jzsEQV"
);

// Tạo đối tượng Token từ mint address
const token = new Token(connection, itemTokenMint, TOKEN_PROGRAM_ID, payer);

// Lấy tài khoản token của người chơi
const playerTokenAccount = await token.getOrCreateAssociatedAccountInfo(
  playerPublicKey
);

// Chuyển 10 token vào tài khoản của người chơi
const amount = 10; // Số lượng vật phẩm mua
await token.transfer(
  payer.publicKey,
  playerTokenAccount.address,
  payer,
  [],
  amount
);
