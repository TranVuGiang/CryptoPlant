// Import các module cần thiết từ thư viện Anchor
use anchor_lang::prelude::*;

// Khai báo các module con
mod errors;
mod instructions;
mod state;

// Import tất cả các thành phần từ các module
use errors::*;
use instructions::*;
use state::*;

// Khai báo ID của chương trình
declare_id!("F9q3LimRzpLZRj37KTFfNg7xaQn7NhhA5pyW3rq65bpE");

pub const DEFAULT_RATE: u64 = 1_000; // 1000 CTC = 1 SOL
                                     // Module chính của chương trình
#[program]
pub mod cryptoplant {
    use super::*;

    // Hàm khởi tạo sàn giao dịch với tỷ giá được chỉ định
    pub fn initialize_exchange(ctx: Context<InitializeExchange>) -> Result<()> {
        instructions::initialize_exchange::handle(ctx, DEFAULT_RATE)
    }

    // Hàm swap SOL sang CTC (token của game) với số lượng SOL được chỉ định
    pub fn swap_sol_to_ctc(ctx: Context<SwapSolToCtc>, amount_sol: u64) -> Result<()> {
        instructions::swap_sol_to_ctc::handle(ctx, amount_sol)
    }

    // Hàm tạo người chơi mới với tên được chỉ định
    pub fn create_player(ctx: Context<CreatePlayer>, name: String) -> Result<()> {
        instructions::player::create_player(ctx, name)
    }

    // Hàm cập nhật điểm số của người chơi
    pub fn update_player_score(ctx: Context<UpdatePlayer>, new_score: u64) -> Result<()> {
        instructions::player::update_player_score(ctx, new_score)
    }

    pub fn buy_item(ctx: Context<BuyItem>, amount: u64, price_per_item: u64) -> Result<()> {
        instructions::buy_item::handle(ctx, amount, price_per_item)
    }

    pub fn use_item(ctx: Context<UseItem>, amount: u64, xp_boost_percent: u64) -> Result<()> {
        instructions::use_item::use_item(ctx, amount, xp_boost_percent)
    }

    pub fn claim_rewards(ctx: Context<ClaimReward>) -> Result<()> {
        instructions::claim_rewards::claim(ctx)
    }
    // Các hàm khác giữ nguyên...
}
