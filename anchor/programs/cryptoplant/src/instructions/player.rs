use crate::state::Player;
use anchor_lang::prelude::*;

// Hàm tạo người chơi mới
pub fn create_player(ctx: Context<CreatePlayer>, name: String) -> Result<()> {
    let player = &mut ctx.accounts.player;
    player.authority = ctx.accounts.authority.key(); // Gán authority chính xác
    player.name = name;
    player.score = 0;
    player.level = 1;
    player.balance = 1000;
    player.created_at = Clock::get()?.unix_timestamp;
    Ok(())
}

// Hàm cập nhật điểm số của người chơi
pub fn update_player_score(ctx: Context<UpdatePlayer>, new_score: u64) -> Result<()> {
    // Lấy tham chiếu đến tài khoản player và cập nhật thông tin
    let player = &mut ctx.accounts.player;
    player.score = new_score; // Cập nhật điểm số mới
    player.level = (new_score / 1000 + 1) as u8; // Tính toán cấp độ dựa trên điểm số
    Ok(())
}

// Cấu trúc chứa thông tin các tài khoản cần thiết cho việc tạo người chơi
#[derive(Accounts)]
pub struct CreatePlayer<'info> {
    // Admin thực hiện ký và trả phí tạo tài khoản
    #[account(mut)]
    pub admin: Signer<'info>,

    // Tài khoản lưu thông tin người chơi (PDA)
    #[account(
        init,
        payer = admin, // Admin trả phí
        space = 8 + Player::INIT_SPACE,
        seeds = [b"player", authority.key().as_ref()],
        bump
    )]
    pub player: Account<'info, Player>,

    // Authority lưu public key người chơi (không cần ký)
    pub authority: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

// Cấu trúc chứa thông tin các tài khoản cần thiết cho việc cập nhật điểm số
#[derive(Accounts)]
pub struct UpdatePlayer<'info> {
    // Tài khoản người chơi (người ký giao dịch)
    #[account(mut)]
    pub authority: Signer<'info>,

    // Tài khoản lưu thông tin người chơi (PDA)
    #[account(
        mut,
        has_one = authority,     // Kiểm tra quyền sở hữu
        seeds = [b"player", authority.key().as_ref()], // Seeds để tìm PDA
        bump                     // Lưu bump seed
    )]
    pub player: Account<'info, Player>,
}
