// Import các module cần thiết từ thư viện Anchor
use anchor_lang::prelude::*;

// Định nghĩa cấu trúc dữ liệu cho tài khoản Cryptoplant
#[account]
#[derive(InitSpace)]
pub struct Cryptoplant {
    // Biến đếm số lượng (có thể dùng để theo dõi số lượng người chơi hoặc các hoạt động khác)
    count: u8,
}
