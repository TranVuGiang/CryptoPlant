use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, Token, TokenAccount};

use crate::state::Player;

#[derive(Accounts)]
pub struct UseItem<'info> {
    #[account(
        mut,
        seeds = [b"player", authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub player: Account<'info, Player>,

    pub authority: Signer<'info>,

    pub item_mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = item_mint,
        associated_token::authority = authority
    )]
    pub player_item_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn use_item(ctx: Context<UseItem>, amount: u64, xp_boost_percent: u64) -> Result<()> {
    let player = &mut ctx.accounts.player;
    let player_item_account = &ctx.accounts.player_item_account;

    require!(
        player_item_account.amount >= amount,
        CustomError::NotEnoughItem
    );

    // 🔥 Burn vật phẩm
    token::burn(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.item_mint.to_account_info(),
                from: player_item_account.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        amount,
    )?;

    // 📈 Cộng điểm
    let base_xp_per_item = 10; // Mỗi item cơ bản 10 XP
    let added_xp_per_item = base_xp_per_item * xp_boost_percent / 100;
    let total_added_xp = added_xp_per_item * amount;

    player.score = player
        .score
        .checked_add(total_added_xp)
        .ok_or(CustomError::NumericalOverflow)?;

    // ⚡ Up Level
    while player.score >= 100 {
        player.level = player
            .level
            .checked_add(1)
            .ok_or(CustomError::NumericalOverflow)?;
        player.score -= 100;
    }

    Ok(())
}

#[error_code]
pub enum CustomError {
    #[msg("Không đủ số lượng vật phẩm để sử dụng.")]
    NotEnoughItem,

    #[msg("Lỗi tràn số khi cộng điểm.")]
    NumericalOverflow,
}
