// Import các module cần thiết từ thư viện Anchor
use anchor_lang::prelude::*;

// Định nghĩa các mã lỗi có thể xảy ra trong chương trình
#[error_code]
pub enum ErrorCode {
    // Lỗi tràn số khi thực hiện các phép tính
    #[msg("Math operation overflow")]
    NumberOverflow,
    #[msg("Name is too long")]
    NameTooLong,
    #[msg("Description is too long")]
    DescriptionTooLong,
    #[msg("Max supply exceeded")]
    MaxSupplyExceeded,
    #[msg("Item is not active")]
    ItemNotActive,
    #[msg("Player does not have enough CPC.")]
    InsufficientCPC,
    #[msg("Overflow occurred.")]
    Overflow,
}
