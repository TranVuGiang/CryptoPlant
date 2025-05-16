import { getKeypairFromFile } from "@solana-developers/helpers";
import { getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import cluster from "cluster";

const mintPublicKey = new PublicKey(
  "EuF9wyqm72EzcS3WZL93wWrKwi66CYbNBGtqu1jzsEQV"
);
const userPublicKey = await getKeypairFromFile();

const connection = new Connection(clusterApiUrl("devnet"));

const mint = new PublicKey("mntNPr2hDATxdWU2nsH1A4RTRozdUUVSHaQgiUW5gEu");
const owner = new PublicKey("8EL7pwkoPo6mZdnArGwgEmHXnBmMDDhzN9g1EgsByQsx");

const ataOwnerAddress = await getAssociatedTokenAddress(mint, owner);
console.log("Computed ATA:", ataOwnerAddress.toBase58());






// const ata = await getOrCreateAssociatedTokenAccount(
//   connection,
//   userPublicKey,
//   mintPublicKey,
//   userPublicKey.publicKey
// );

// const mintAmount = 10_000; // số lượng token

// await mintTo(
//   connection,
//   userPublicKey,
//   mintPublicKey,
//   ata.address,
//   userPublicKey.publicKey,
//   mintAmount * 10 ** 0 // nhân thêm nếu decimals > 0
// );

console.log("✅ Minted public key: ", userPublicKey.publicKey);
