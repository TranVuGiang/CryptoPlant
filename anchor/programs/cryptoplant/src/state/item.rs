use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Item {
    pub item_id: u64, // ID của vật phẩm
    #[max_len(50)]
    pub name: String, // Tên vật phẩm
    pub price: u64,   // Giá vật phẩm
    pub mint: Pubkey, // Mint address của vật phẩm
    #[max_len(255)]
    pub description: String, // Mô tả vật phẩm
    #[max_len(255)]
    pub image_cid: String,
}
