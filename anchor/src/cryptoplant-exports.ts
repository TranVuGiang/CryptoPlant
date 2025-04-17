// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import CryptoplantIDL from '../target/idl/cryptoplant.json'
import type { Cryptoplant } from '../target/types/cryptoplant'

// Re-export the generated IDL and type
export { Cryptoplant, CryptoplantIDL }

// The programId is imported from the program IDL.
export const CRYPTOPLANT_PROGRAM_ID = new PublicKey(CryptoplantIDL.address)

// This is a helper function to get the Cryptoplant Anchor program.
export function getCryptoplantProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...CryptoplantIDL, address: address ? address.toBase58() : CryptoplantIDL.address } as Cryptoplant, provider)
}

// This is a helper function to get the program ID for the Cryptoplant program depending on the cluster.
export function getCryptoplantProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Cryptoplant program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return CRYPTOPLANT_PROGRAM_ID
  }
}
