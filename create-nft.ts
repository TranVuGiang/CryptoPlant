import {
  createFungible,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  getKeypairFromFile,
  getExplorerLink,
} from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  some,
} from "@metaplex-foundation/umi";
import pinataSDK from "@pinata/sdk";
import fs from "fs";

async function uploadMetadata(
  name: string,
  symbol: string,
  description: string,
  imagePath: string,
  attributes: any[]
) {
  const pinata = new pinataSDK(
    "4a02bf3451f00a2e4c63",
    "93c778ac93d571a08b54e3ca8cacb50a371a631f37430d8207db59ae2dd7dc20"
  );

  const imgStream = fs.createReadStream(imagePath);
  const imgRes = await pinata.pinFileToIPFS(imgStream, {
    pinataMetadata: { name: `${name}.png` },
  });
  const imageUri = `https://lime-calm-cobra-390.mypinata.cloud/ipfs/${imgRes.IpfsHash}`;

  console.log(`✅ Image uploaded for ${name}:`, imageUri);

  const metadata = {
    name: name,
    symbol: symbol,
    description: description,
    image: imageUri,
    attributes: attributes,
    properties: {
      files: [{ uri: imageUri, type: "image/png" }],
      category: "image",
      creators: [
        {
          address: "FG3zw7vkVRyTEiajSZkZMxGafjUShK7fL88vC4pkZewf", // Chủ sở hữu
          share: 100,
        },
      ],
    },
  };

  const jsonRes = await pinata.pinJSONToIPFS(metadata);
  const metadataUri = `https://lime-calm-cobra-390.mypinata.cloud/ipfs/${jsonRes.IpfsHash}`;
  return metadataUri;
}

async function createFtToken({
  name,
  symbol,
  description,
  imagePath,
  attributes,
  decimals = 0,
}: {
  name: string;
  symbol: string;
  description: string;
  imagePath: string;
  attributes: any[];
  decimals?: number;
}) {
  const connection = new Connection(clusterApiUrl("devnet"));
  const user = await getKeypairFromFile();
  const umi = createUmi(connection.rpcEndpoint);

  umi.use(mplTokenMetadata());
  umi.use(
    keypairIdentity(umi.eddsa.createKeypairFromSecretKey(user.secretKey))
  );

  console.log(`🚀 Creating FT: ${name}`);

  const metadataUri = await uploadMetadata(
    name,
    symbol,
    description,
    imagePath,
    attributes
  );

  const mint = generateSigner(umi);

  await createFungible(umi, {
    mint,
    name,
    symbol,
    uri: metadataUri,
    decimals,
    sellerFeeBasisPoints: percentAmount(0),
  }).sendAndConfirm(umi);

  console.log(
    `🎉 Created FT ${name}! Mint Address: ${getExplorerLink(
      "address",
      mint.publicKey,
      "devnet"
    )}`
  );
}

// ================================
// 🛠️ TẠO CÁC FT CỦA TỪNG COLLECTION
// ================================

// --- Water Collection ---
await createFtToken({
  name: "Water Supply",
  symbol: "WATER",
  description: "Used to reduce fruit harvest time in Crypto Plant.",
  imagePath: "./public/collections/water_supply.png",
  attributes: [
    { trait_type: "Effect", value: "Reduce Harvest Time" },
    { trait_type: "Harvest Time Reduction", value: "10%" },
  ],
});

// --- Fertilizer Collection ---
await createFtToken({
  name: "Basic Fertilizer",
  symbol: "FERTI1",
  description: "Increase XP and reduce harvest time by a small amount.",
  imagePath: "./public/collections/fertilizer_basic.png",
  attributes: [
    { trait_type: "Effect", value: "Increase XP, Reduce Harvest Time" },
    { trait_type: "XP Boost", value: "5%" },
    { trait_type: "Harvest Time Reduction", value: "5%" },
  ],
});

await createFtToken({
  name: "Advanced Fertilizer",
  symbol: "FERTI2",
  description: "Moderately boosts XP and significantly reduces harvest time.",
  imagePath: "./public/collections/fertilizer_advanced.png",
  attributes: [
    { trait_type: "Effect", value: "Increase XP, Reduce Harvest Time" },
    { trait_type: "XP Boost", value: "10%" },
    { trait_type: "Harvest Time Reduction", value: "10%" },
  ],
});

await createFtToken({
  name: "Premium Fertilizer",
  symbol: "FERTI3",
  description: "Massively boosts XP and greatly reduces harvest time.",
  imagePath: "./public/collections/fertilizer_premium.png",
  attributes: [
    { trait_type: "Effect", value: "Increase XP, Reduce Harvest Time" },
    { trait_type: "XP Boost", value: "20%" },
    { trait_type: "Harvest Time Reduction", value: "20%" },
  ],
});
