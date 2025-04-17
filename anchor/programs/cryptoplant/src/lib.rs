#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod cryptoplant {
    use super::*;

  pub fn close(_ctx: Context<CloseCryptoplant>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.cryptoplant.count = ctx.accounts.cryptoplant.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.cryptoplant.count = ctx.accounts.cryptoplant.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeCryptoplant>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.cryptoplant.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeCryptoplant<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Cryptoplant::INIT_SPACE,
  payer = payer
  )]
  pub cryptoplant: Account<'info, Cryptoplant>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseCryptoplant<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub cryptoplant: Account<'info, Cryptoplant>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub cryptoplant: Account<'info, Cryptoplant>,
}

#[account]
#[derive(InitSpace)]
pub struct Cryptoplant {
  count: u8,
}
