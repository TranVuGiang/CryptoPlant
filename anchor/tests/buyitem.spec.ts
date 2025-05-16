import { Program } from "@coral-xyz/anchor";
import { Cryptoplant } from "../target/types/cryptoplant";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const IDL = require("../target/idl/cryptoplant.json");

describe("cryptoplant", () => {
  jest.setTimeout(10000);

  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  const wallet = anchor.Wallet.local();

  const authority = wallet.payer;
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  const program = anchor.workspace.Cryptoplant as Program<Cryptoplant>;

  const playerName = "Crypto Hero";
  let playerPda: anchor.web3.PublicKey;
  let playerBump: number;
  let playerItemAccount: PublicKey;
  const itemMint = new PublicKey(
    "EuF9wyqm72EzcS3WZL93wWrKwi66CYbNBGtqu1jzsEQV"
  );

  const playerWallet = new PublicKey(
    "7gqAiUkjDGJSVxKhT2z9dHbfiqHAu3r2i4KTJvZMooLB"
  );

  const amount = new anchor.BN(5); // số lượng item muốn mua
  const pricePerItem = new anchor.BN(100);

  beforeAll(async () => {
    [playerPda, playerBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("player"), playerWallet.toBuffer()],
      program.programId
    );

    playerItemAccount = await anchor.utils.token.associatedAddress({
      mint: itemMint,
      owner: authority.publicKey,
    });
  });

  it("Buy item - extended debug", async () => {
    // 3. Tạo player
    await program.methods
      .createPlayer(playerName)
      .accounts({
        admin: authority.publicKey,
        player: playerPda,
        authority: playerWallet,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([authority])
      .rpc();

    const playerAccount = await program.account.player.fetch(playerPda);
    console.log("Player: ", playerAccount);

    // 7. Gọi buyItem

    await program.methods
      .buyItem(amount, pricePerItem)
      .accounts({
        player: playerPda,
      })
      .signers([authority])
      .rpc();

    const playerAccountBalance = await program.account.player.fetch(playerPda);
    console.log("Player balance: ", playerAccountBalance.balance.toString());

    // 3. Dùng item
  });
});
