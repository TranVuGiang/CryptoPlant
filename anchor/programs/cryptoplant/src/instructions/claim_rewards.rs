use anchor_lang::prelude::*;

use crate::state::Player;

pub fn claim(ctx: Context<ClaimReward>) -> Result<()> {
    let player = &mut ctx.accounts.player;

    // Reward logic based on player's level
    let reward_amount = match player.level {
        1 => 10,
        2 => 20,
        3 => 30,
        4 => 50,
        5 => 80,
        _ => 100, // Default reward for level >5
    };

    player.balance += reward_amount;

    Ok(())
}

#[derive(Accounts)]
pub struct ClaimReward<'info> {
    #[account(mut)]
    pub player: Account<'info, Player>,
}
