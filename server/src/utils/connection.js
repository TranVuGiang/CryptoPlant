const { Connection, clusterApiUrl, PublicKey } = require("@solana/web3.js");
const { Metaplex } = require("@metaplex-foundation/js");

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const metaplex = new Metaplex(connection);

module.exports = { connection, metaplex };
