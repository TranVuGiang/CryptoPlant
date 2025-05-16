import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { getKeypairFromFile } from "@solana-developers/helpers";
import {
  mplTokenMetadata,
  fetchAllDigitalAssetByOwner,
} from "@metaplex-foundation/mpl-token-metadata";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { keypairIdentity } from "@metaplex-foundation/umi";

async function listMyTokens() {
  const connection = new Connection(clusterApiUrl("devnet"));
  const user = await getKeypairFromFile();

  const umi = createUmi(connection.rpcEndpoint);
  umi.use(mplTokenMetadata());
  umi.use(
    keypairIdentity(umi.eddsa.createKeypairFromSecretKey(user.secretKey))
  );

  console.log(`🔍 Listing all tokens for: ${user.publicKey.toBase58()}\n`);

  const assets = await fetchAllDigitalAssetByOwner(umi, user.publicKey);

  if (assets.length === 0) {
    console.log("🚫 No assets found.");
    return;
  }

  assets.forEach((asset: any, index: any) => {
    console.log(`#${index + 1}`);
    console.log(`🪙 Name: ${asset.metadata.name}`);
    console.log(`💠 Mint Address: ${asset.mint.publicKey.toString()}`);
    console.log(`🔗 Metadata URI: ${asset.metadata.uri}`);
    console.log(`🔢 Supply: ${asset.supply.basisPoints.toString()}`);
    console.log("---------------");
  });
}

listMyTokens().catch((err) => {
  console.error("❌ Error listing tokens:", err);
});
