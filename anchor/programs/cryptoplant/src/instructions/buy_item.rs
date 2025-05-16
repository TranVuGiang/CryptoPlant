use crate::state::{player, Player};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, MintTo, Transfer};
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

#[derive(Accounts)]
pub struct BuyItem<'info> {
    #[account(mut)]
    pub player: Account<'info, Player>,
}

pub fn handle(ctx: Context<BuyItem>, amount: u64, price_per_item: u64) -> Result<()> {
    let total_cost = amount
        .checked_mul(price_per_item)
        .ok_or(ErrorCode::Overflow)?;

    require!(
        ctx.accounts.player.balance >= total_cost,
        ErrorCode::InsufficientCPC
    );

    // Deduct balance from player
    ctx.accounts.player.balance = ctx
        .accounts
        .player
        .balance
        .checked_sub(total_cost)
        .ok_or(ErrorCode::Overflow)?;

    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("Player does not have enough CPC.")]
    InsufficientCPC,
    #[msg("Overflow occurred.")]
    Overflow,
}
