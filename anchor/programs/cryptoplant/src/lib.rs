#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

// Định danh chương trình (Program ID) trên Solana
declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod cryptoplant {
    use super::*;

    // Tạo tài khoản người chơi mới
    pub fn create_player(ctx: Context<CreatePlayer>, name: String) -> Result<()> {
        let player = &mut ctx.accounts.player;
        player.authority = ctx.accounts.authority.key(); // Lưu public key của người chơi
        player.name = name; // Lưu tên người chơi
        player.score = 0; // Khởi tạo điểm số ban đầu
        player.level = 1; // Khởi tạo cấp độ ban đầu
        player.created_at = Clock::get()?.unix_timestamp; // Lưu thời gian tạo tài khoản
        Ok(())
    }

    // Cập nhật điểm số người chơi
    pub fn update_player_score(ctx: Context<UpdatePlayer>, new_score: u64) -> Result<()> {
        let player = &mut ctx.accounts.player;
        player.score = new_score;
        // Cập nhật cấp độ dựa trên điểm số (mỗi 1000 điểm tăng 1 cấp)
        player.level = (new_score / 1000 + 1) as u8;
        Ok(())
    }

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

// Cấu trúc tài khoản để tạo người chơi mới
#[derive(Accounts)]
pub struct CreatePlayer<'info> {
    #[account(mut)]
    pub authority: Signer<'info>, // Người ký giao dịch

    #[account(
        init, // Khởi tạo tài khoản mới
        payer = authority, // Người trả phí tạo tài khoản
        space = 8 + Player::INIT_SPACE, // Kích thước tài khoản
        seeds = [b"player", authority.key().as_ref()], // Tạo PDA với seed là "player" và public key
        bump // Sử dụng bump để tìm PDA
    )]
    pub player: Account<'info, Player>,
    pub system_program: Program<'info, System>,
}

// Cấu trúc tài khoản để cập nhật điểm số người chơi
#[derive(Accounts)]
pub struct UpdatePlayer<'info> {
    #[account(mut)]
    pub authority: Signer<'info>, // Người ký giao dịch

    #[account(
        mut,
        has_one = authority, // Kiểm tra xem authority có phải là chủ sở hữu của tài khoản không
        seeds = [b"player", authority.key().as_ref()], // Tìm PDA với seed tương tự
        bump
    )]
    pub player: Account<'info, Player>,
}
x`x`
#[account]
#[derive(InitSpace)]
pub struct Cryptoplant {
    count: u8,
}

// Cấu trúc dữ liệu của tài khoản người chơi
#[account]
#[derive(InitSpace)]
pub struct Player {
    pub authority: Pubkey, // Public key của người chơi
    #[max_len(155)]
    pub name: String, // Tên người chơi (tối đa 155 ký tự)
    pub score: u64, // Điểm số
    pub level: u8, // Cấp độ
    pub created_at: i64, // Thời gian tạo tài khoản
}
