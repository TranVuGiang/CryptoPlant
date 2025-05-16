use anchor_lang::prelude::*;

// Định nghĩa cấu trúc dữ liệu cho tài khoản Exchange (sàn giao dịch)
#[account]
#[derive(InitSpace)]
pub struct Exchange {
    // Public key của admin (người quản lý sàn)
    pub admin: Pubkey,
    // Public key của token mint CTC (nơi tạo token)
    pub ctc_mint: Pubkey,
    // Public key của ví chứa token CTC
    pub ctc_vault: Pubkey,
    // Public key của ví chứa SOL
    pub sol_vault: Pubkey,
    // Tỷ giá quy đổi giữa SOL và CTC
    pub rate: u64,
}
