import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Cryptoplant } from '../target/types/cryptoplant'

describe('cryptoplant', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Cryptoplant as Program<Cryptoplant>

  const cryptoplantKeypair = Keypair.generate()

  it('Initialize Cryptoplant', async () => {
    await program.methods
      .initialize()
      .accounts({
        cryptoplant: cryptoplantKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([cryptoplantKeypair])
      .rpc()

    const currentCount = await program.account.cryptoplant.fetch(cryptoplantKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Cryptoplant', async () => {
    await program.methods.increment().accounts({ cryptoplant: cryptoplantKeypair.publicKey }).rpc()

    const currentCount = await program.account.cryptoplant.fetch(cryptoplantKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Cryptoplant Again', async () => {
    await program.methods.increment().accounts({ cryptoplant: cryptoplantKeypair.publicKey }).rpc()

    const currentCount = await program.account.cryptoplant.fetch(cryptoplantKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Cryptoplant', async () => {
    await program.methods.decrement().accounts({ cryptoplant: cryptoplantKeypair.publicKey }).rpc()

    const currentCount = await program.account.cryptoplant.fetch(cryptoplantKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set cryptoplant value', async () => {
    await program.methods.set(42).accounts({ cryptoplant: cryptoplantKeypair.publicKey }).rpc()

    const currentCount = await program.account.cryptoplant.fetch(cryptoplantKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the cryptoplant account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        cryptoplant: cryptoplantKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.cryptoplant.fetchNullable(cryptoplantKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
