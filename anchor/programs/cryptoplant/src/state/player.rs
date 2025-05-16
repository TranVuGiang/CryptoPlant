use anchor_lang::prelude::*;

// Định nghĩa cấu trúc dữ liệu cho tài khoản Player
#[account]
#[derive(InitSpace)]
pub struct Player {
    // Public key của người chơi (địa chỉ ví)
    pub authority: Pubkey,
    // Tên người chơi (tối đa 155 ký tự)
    #[max_len(155)]
    pub name: String,
    // Điểm số của người chơi trong game
    pub score: u64,
    // Cấp độ hiện tại của người chơi
    pub level: u8,
    // Số dư token trong game của người chơi
    pub balance: u64,
    // Thời gian tạo tài khoản (timestamp)
    pub created_at: i64,
    // XP hien tai
    pub xp: u64,
}
