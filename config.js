module.exports = {
    // Default delay between messages in seconds
    DEFAULT_DELAY_SECONDS: 5,
    
    // Session configuration
    SESSION_PATH: './session',
    
    // Bot settings
    BOT_NAME: 'WhatsApp Bulk Sender',
    
    // Safety limits
    MAX_DELAY_SECONDS: 300, // 5 minutes
    MIN_DELAY_SECONDS: 1,   // 1 second
    
    // Retry settings
    MAX_RETRIES: 3,
    RETRY_DELAY_MS: 2000
};
