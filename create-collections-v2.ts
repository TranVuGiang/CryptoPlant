import {
    createNft,
    fetchDigitalAsset,
    mplTokenMetadata,
  } from "@metaplex-foundation/mpl-token-metadata";
  import {
    getKeypairFromFile,
    getExplorerLink,
  } from "@solana-developers/helpers";
  import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
  import { clusterApiUrl, Connection } from "@solana/web3.js";
  import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
  import pinataSDK from "@pinata/sdk";
  import fs from "fs";
  
  async function createCollection({
    collectionName,
    symbol,
    description,
    imagePath,
  }: {
    collectionName: string;
    symbol: string;
    description: string;
    imagePath: string;
  }) {
    const pinata = new pinataSDK(
      "4a02bf3451f00a2e4c63",
      "93c778ac93d571a08b54e3ca8cacb50a371a631f37430d8207db59ae2dd7dc20"
    );
  
    // Upload image to IPFS
    const imgStream = fs.createReadStream(imagePath);
    const imgRes = await pinata.pinFileToIPFS(imgStream, {
      pinataMetadata: { name: `${collectionName}.png` },
    });
    const imageUri = `https://lime-calm-cobra-390.mypinata.cloud/ipfs/${imgRes.IpfsHash}`;
  
    console.log("✅ Image Uploaded:", imageUri);
  
    // Upload metadata to IPFS
    const metadata = {
      name: collectionName,
      symbol: symbol,
      description: description,
      image: imageUri,
      collection: {
        name: collectionName,
        family: "CryptoPlant",
      },
      properties: {
        files: [{ uri: imageUri, type: "image/png" }],
        category: "image",
        creators: [
          {
            address: "FG3zw7vkVRyTEiajSZkZMxGafjUShK7fL88vC4pkZewf", // Thay bằng ví của bạn nếu cần
            share: 100,
          },
        ],
      },
    };
  
    const jsonRes = await pinata.pinJSONToIPFS(metadata);
    const metadataUri = `https://lime-calm-cobra-390.mypinata.cloud/ipfs/${jsonRes.IpfsHash}`;
    console.log("✅ Metadata Uploaded:", metadataUri);
  
    // Setup Solana Connection
    const connection = new Connection(clusterApiUrl("devnet"));
    const user = await getKeypairFromFile();
    const umi = createUmi(connection.rpcEndpoint);
  
    umi.use(mplTokenMetadata());
    umi.use(keypairIdentity(umi.eddsa.createKeypairFromSecretKey(user.secretKey)));
  
    console.log("🚀 Ready to create Collection NFT...");
  
    // Mint Collection NFT
    const collectionMint = generateSigner(umi);
  
    await createNft(umi, {
      mint: collectionMint,
      name: collectionName,
      symbol: symbol,
      uri: metadataUri,
      sellerFeeBasisPoints: percentAmount(0),
      isCollection: true,
    }).sendAndConfirm(umi);
  
    const createdCollectionNft = await fetchDigitalAsset(
      umi,
      collectionMint.publicKey
    );
  
    console.log(
      `🎉 Created Collection NFT! View here: ${getExplorerLink(
        "address",
        createdCollectionNft.mint.publicKey,
        "devnet"
      )}`
    );
  }
  
  // ===========================
  // 🛠️ GỌI ĐỂ TẠO BỘ SƯU TẬP
  // ===========================
  
  await createCollection({
    collectionName: "Fertilizer Collection",
    symbol: "FERTI",
    description: "Official collection of Fertilizers in Crypto Plant game.",
    imagePath: "./public/collections/fertilizer.png",
  });
  
  // Hoặc muốn tạo Water Collection chỉ cần thay như sau:
  
  await createCollection({
    collectionName: "Water Collection",
    symbol: "WATER",
    description: "Official collection of Water Supplies in Crypto Plant game.",
    imagePath: "./public/collections/water.png",
  });
  