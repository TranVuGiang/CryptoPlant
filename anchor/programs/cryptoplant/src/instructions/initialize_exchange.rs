use crate::state::Exchange;
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, Token, TokenAccount};



// Hàm xử lý khởi tạo sàn giao dịch
pub fn handle(ctx: Context<InitializeExchange>, rate: u64) -> Result<()> {
    // Lấy tham chiếu đến tài khoản exchange và cập nhật thông tin
    let exchange = &mut ctx.accounts.exchange;
    exchange.admin = ctx.accounts.admin.key();        // Lưu public key của admin
    exchange.ctc_mint = ctx.accounts.ctc_mint.key(); // Lưu public key của token mint
    exchange.ctc_vault = ctx.accounts.ctc_vault.key(); // Lưu public key của ví CTC
    exchange.sol_vault = ctx.accounts.sol_vault.key(); // Lưu public key của ví SOL
    exchange.rate = rate;                            // Lưu tỷ giá quy đổi
    Ok(())
}

// Cấu trúc chứa thông tin các tài khoản cần thiết cho việc khởi tạo sàn
#[derive(Accounts)]
pub struct InitializeExchange<'info> {
    // Tài khoản sàn giao dịch (PDA)
    #[account(
        init,                    // Khởi tạo tài khoản mới
        payer = admin,           // Admin trả phí khởi tạo
        seeds = [b"exchange", admin.key().as_ref()], // Seeds để tạo PDA
        bump,                    // Lưu bump seed
        space = 8 + 32 + 8, // Không gian cần thiết cho tài khoản
      )]
    pub exchange: Account<'info, Exchange>,

    // Tài khoản admin (người khởi tạo sàn)
    #[account(mut)]
    pub admin: Signer<'info>,

    // Tài khoản mint của token CTC
    /// The CPC mint (must already exist)
    pub ctc_mint: Account<'info, Mint>,

    // Tài khoản ví chứa token CTC
    /// The associated token account (vault) for CPC
    #[account(
        init,                    // Khởi tạo tài khoản mới
        payer = admin,           // Admin trả phí khởi tạo
        associated_token::mint = ctc_mint, // Liên kết với mint
        associated_token::authority = exchange, // Ví thuộc quyền sở hữu của sàn
      )]
    pub ctc_vault: Account<'info, TokenAccount>,

    // Tài khoản ví chứa SOL (PDA)
    /// PDA to collect SOL
    #[account(
        mut,
        seeds = [b"sol_vault", exchange.key().as_ref()], // Seeds để tạo PDA
        bump,                    // Lưu bump seed
      )]
    pub sol_vault: SystemAccount<'info>,

    // Các chương trình hệ thống cần thiết
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}
