import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import {
  airdropIfRequired,
  getKeypairFromFile,
  getExplorerLink,
} from "@solana-developers/helpers";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
} from "@metaplex-foundation/umi";

import pinataSDK from "@pinata/sdk";
import fs from "fs";

const pinata = new pinataSDK(
  "4a02bf3451f00a2e4c63",
  "93c778ac93d571a08b54e3ca8cacb50a371a631f37430d8207db59ae2dd7dc20"
);

//Pin image
const imgStream = fs.createReadStream("./collections/collection_main_tree.png");
const imgRes = await pinata.pinFileToIPFS(imgStream, {
  pinataMetadata: {
    name: "collection_main_tree.png",
  },
});
const imageUri = `https://lime-calm-cobra-390.mypinata.cloud/ipfs/${imgRes.IpfsHash}`;

console.log("Image File: ", imageUri);

const metadata = {
  name: "Main Trees Collection",
  symbol: "MTC",
  description:
    "This is the official collection of MainTrees in the Crypto Plant game.",
  image: imageUri,
  collection: {
    name: "Main Trees Collection",
    family: "CryptoPlant",
  },
  properties: {
    files: [
      {
        uri: imageUri,
        type: "image/png",
      },
    ],
    category: "image",
    creators: [
      {
        address: "FG3zw7vkVRyTEiajSZkZMxGafjUShK7fL88vC4pkZewf",
        share: 100,
      },
    ],
  },
};

const jsonRes = await pinata.pinJSONToIPFS(metadata);
const metadataUri = `https://lime-calm-cobra-390.mypinata.cloud/ipfs/${jsonRes.IpfsHash}`;

console.log("Metadata URI: ", metadataUri);

const connection = new Connection(clusterApiUrl("devnet"));

const user = await getKeypairFromFile();

await airdropIfRequired(
  connection,
  user.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.5 * LAMPORTS_PER_SOL
);

console.log("Loaded User", user.publicKey.toBase58());

const umi = createUmi(connection.rpcEndpoint);

umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);

umi.use(keypairIdentity(umiUser));

console.log("Set up Umi instance for user");

const collectionMint = generateSigner(umi);

console.log(collectionMint);

await createNft(umi, {
  mint: collectionMint,
  name: "Main Tree Collection",
  symbol: "MTC",
  uri: metadataUri,
  sellerFeeBasisPoints: percentAmount(0),
  isCollection: true,
}).sendAndConfirm(umi);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// Đợi 2 giây để transaction được xác nhận
await sleep(2000);

const createdCollectionNft = await fetchDigitalAsset(
  umi,
  collectionMint.publicKey
);
console.log(
  `Create Collection box! Address ${getExplorerLink(
    "address",
    createdCollectionNft.mint.publicKey,
    "devnet"
  )}`
);
