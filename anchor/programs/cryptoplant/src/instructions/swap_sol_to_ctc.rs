use crate::errors::ErrorCode;
use crate::state::Exchange;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{transfer, Mint, Token, TokenAccount, Transfer};

pub fn handle(ctx: Context<SwapSolToCtc>, amount_sol: u64) -> Result<()> {
    let exchange = &ctx.accounts.exchange;
    let transfer_sol_ix = system_instruction::transfer(
        &ctx.accounts.user.key(),
        &ctx.accounts.sol_vault.key(),
        amount_sol,
    );
    anchor_lang::solana_program::program::invoke(
        &transfer_sol_ix,
        &[
            ctx.accounts.user.to_account_info(),
            ctx.accounts.sol_vault.to_account_info(),
        ],
    )?;

    let ctc_amount = amount_sol
        .checked_mul(exchange.rate)
        .ok_or(ErrorCode::NumberOverflow)?;

    let seeds = &[b"exchange", exchange.admin.as_ref(), &[ctx.bumps.exchange]];
    let signer = &[&seeds[..]];

    let cpi_accounts = Transfer {
        from: ctx.accounts.ctc_vault.to_account_info(),
        to: ctx.accounts.user_ctc_ata.to_account_info(),
        authority: ctx.accounts.exchange.to_account_info(),
    };

    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts,
        signer,
    );

    transfer(cpi_ctx, ctc_amount)?;

    Ok(())
}

#[derive(Accounts)]
pub struct SwapSolToCtc<'info> {
    #[account(
        mut,
        seeds = [b"exchange", exchange.admin.as_ref()],
        bump
    )]
    pub exchange: Account<'info, Exchange>,

    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: This is safe as it's just a SOL vault
    #[account(
        mut,
        seeds = [b"sol_vault", exchange.key().as_ref()],
        bump
    )]
    pub sol_vault: AccountInfo<'info>,

    #[account(mut)]
    pub ctc_vault: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = user,
        associated_token::mint = ctc_mint,
        associated_token::authority = user
    )]
    pub user_ctc_ata: Account<'info, TokenAccount>,

    pub ctc_mint: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}
