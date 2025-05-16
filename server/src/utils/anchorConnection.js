const { Program } = require("@coral-xyz/anchor");
const { Keypair } = require("@solana/web3.js");
const { connection } = require("../utils/connection.js");
const anchor = require("@project-serum/anchor");

// const adminWallet = Keypair.fromSecretKey(
//   Uint8Array.from(
//     JSON.parse(
//       require("fs").readFileSync("/Users/mbp/.config/solana/id.json").toString()
//     )
//   )
// );

const wallet = anchor.Wallet.local();

const adminWallet = wallet.payer;

const IDL = require("../../../anchor/target/idl/cryptoplant.json");

const provider = new anchor.AnchorProvider(connection, wallet, {
  commitment: "confirmed",
});
anchor.setProvider(provider);

const program = new Program(IDL, provider);

module.exports = { program, provider, wallet, adminWallet };
