import * as anchor from "@coral-xyz/anchor";
import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { Cryptoplant } from "../target/types/cryptoplant";

import { BN, Program } from "@coral-xyz/anchor";
import { getKeypairFromFile } from "@solana-developers/helpers";
import fs from "fs"

const IDL = require("../target/idl/cryptoplant.json");

const PROGRAM_ID = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

const ITEM_MINT = new PublicKey("EuF9wyqm72EzcS3WZL93wWrKwi66CYbNBGtqu1jzsEQV");


// Work on both Token Program and new Token Extensions Program
const TOKEN_PROGRAM: typeof TOKEN_2022_PROGRAM_ID | typeof TOKEN_PROGRAM_ID =
  TOKEN_2022_PROGRAM_ID;

describe("cryptoplant", () => {


  const keypair = anchor.Wallet.local();

  const provider = new anchor.AnchorProvider(
    new Connection("https://fancy-my-rpc.devnet.solana.com"),
    keypair,
    { commitment: "confirmed" }
 );

  anchor.setProvider(provider);

  const program = anchor.workspace.Cryptoplant as Program<Cryptoplant>;

  // let authority: anchor.web3.Keypair;
  // let playerPda: anchor.web3.PublicKey;
  // let playerBump: number;

  // let playerName = "CryptoHero";
  // let itemVaultPda: anchor.web3.PublicKey;
  // let itemVaultBump: number;

  // const amount = new anchor.BN(5); // số lượng item muốn mua
  // const pricePerItem = new anchor.BN(100);
  // let payer: Keypair;

  // beforeAll(async () => {
  //   authority = anchor.web3.Keypair.generate();
  //   payer = await getKeypairFromFile();

  //   // Fund the authority account
  //   // const airdropSignature = await provider.connection.requestAirdrop(
  //   //   authority.publicKey,
  //   //   LAMPORTS_PER_SOL
  //   // );
  //   // await provider.connection.confirmTransaction(airdropSignature);

  //   [playerPda, playerBump] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("player"), authority.publicKey.toBuffer()],
  //     program.programId
  //   );

  //   [itemVaultPda, itemVaultBump] =
  //     anchor.web3.PublicKey.findProgramAddressSync(
  //       [Buffer.from("item_vault"), ITEM_MINT.toBuffer()],
  //       program.programId
  //     );
  // });

  // it("Create New Player", async () => {
  //   await program.methods
  //     .createPlayer(playerName)
  //     .accounts({
  //       authority: authority.publicKey,
  //       player: playerPda,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //     })
  //     .signers([authority])
  //     .rpc();

  //   // Fetch the created player account
  //   const playerAccount = await program.account.player.fetch(playerPda);

  //   console.log("====================================");
  //   console.log(playerAccount);
  //   console.log("====================================");

  //   const userTokenAccount = getAssociatedTokenAddressSync(
  //     ITEM_MINT,
  //     authority.publicKey,
  //     false,
  //     TOKEN_2022_PROGRAM_ID
  //   );
  //   const createUserTokenAccountIx = createAssociatedTokenAccountInstruction(
  //     payer.publicKey,
  //     userTokenAccount,
  //     authority.publicKey,
  //     ITEM_MINT,
  //     TOKEN_2022_PROGRAM_ID,
  //     ASSOCIATED_TOKEN_PROGRAM_ID
  //   );

  //   console.log("heheee: ", createUserTokenAccountIx);

  // // Verify the player data
  // expect(playerAccount.authority.toString()).toBe(
  //   authority.publicKey.toString()
  // );
  // expect(playerAccount.name).toBe(playerName);
  // expect(playerAccount.score.toString()).toBe(new BN(0).toString());
  // expect(playerAccount.level).toBe(1);
  // expect(playerAccount.balance.toString()).toBe(new BN(1000).toString());
  // expect(playerAccount.createdAt).toBeDefined();
  // });

  it("buys item successfully", async () => {
    // Step 1: Create player
    // await program.methods
    //   .createPlayer(playerName)
    //   .accounts({
    //     authority: authority.publicKey,
    //     player: playerPda,
    //     systemProgram: anchor.web3.SystemProgram.programId,
    //   })
    //   .signers([authority])
    //   .rpc();

    // // Fetch created player
    // const playerAccount = await program.account.player.fetch(playerPda);

    // console.log("====================================");
    // console.log(playerAccount);
    // console.log("====================================");

    // // Step 2: Setup buyerTokenAccount (ATA for ITEM_MINT)
    // const buyerTokenAccount = getAssociatedTokenAddressSync(
    //   ITEM_MINT,
    //   authority.publicKey,
    //   false,
    //   TOKEN_PROGRAM_ID
    // );


    // const mintInfo = await provider.connection.getAccountInfo(new PublicKey("EuF9wyqm72EzcS3WZL93wWrKwi66CYbNBGtqu1jzsEQV"));
    // if (!mintInfo) {
    //   console.log('Account not found!');
    // } else {
    //   console.log('Mint owner:', mintInfo.owner.toBase58()); // phải là Tokenkeg...
    // }
  

    // Step 5: Now buy item
    // await program.methods
    //   .buyItem(amount, pricePerItem)
    //   .accounts({
    //     player: playerPda,
    //     itemMint: ITEM_MINT,
    //     buyerTokenAccount: buyerTokenAccount,
    //     itemVault: itemVaultPda,
    //     tokenProgram: TOKEN_PROGRAM_ID,
    //   })
    //   .signers([payer])
    //   .rpc();
  });
});
