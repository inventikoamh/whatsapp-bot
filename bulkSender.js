const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('./config');

// Initialize the WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: config.SESSION_PATH
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

/**
 * Sleep/delay function
 * @param {number} seconds - Number of seconds to wait
 */
function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

/**
 * Validate phone number format
 * @param {string} number - Phone number to validate
 * @returns {boolean} - Whether the number is valid
 */
function validatePhoneNumber(number) {
    // Remove all non-digit characters
    const cleaned = number.replace(/\D/g, '');
    // Check if it's a valid length (10-15 digits)
    return cleaned.length >= 10 && cleaned.length <= 15;
}

/**
 * Format phone number to WhatsApp ID
 * @param {string} number - Phone number (with or without country code)
 * @returns {string} - Formatted WhatsApp ID
 */
function formatPhoneNumber(number) {
    // Remove all non-digit characters
    let cleaned = number.replace(/\D/g, '');

    // Add country code if not present (assuming India +91, change as needed)
    // You can modify this logic based on your needs
    if (!cleaned.startsWith('91') && cleaned.length === 10) {
        cleaned = '91' + cleaned; // Add India country code
    }

    return cleaned + '@c.us';
}

/**
 * Send bulk messages to multiple recipients
 * @param {Array} recipients - Array of objects with {number, name} or just phone numbers
 * @param {string|Function} messageTemplate - Message text or function that returns message for each recipient
 * @param {number} delaySeconds - Delay between messages in seconds
 * @param {Function} onProgress - Optional callback for progress updates
 */
async function sendBulkMessages(recipients, messageTemplate, delaySeconds = config.DEFAULT_DELAY_SECONDS, onProgress = null) {
    console.log('\n📨 Starting bulk message sending...');
    console.log(`📊 Total recipients: ${recipients.length}`);
    console.log(`⏱️  Delay between messages: ${delaySeconds} seconds\n`);

    // Validate delay
    if (delaySeconds < config.MIN_DELAY_SECONDS || delaySeconds > config.MAX_DELAY_SECONDS) {
        throw new Error(`Delay must be between ${config.MIN_DELAY_SECONDS} and ${config.MAX_DELAY_SECONDS} seconds`);
    }

    const results = {
        total: recipients.length,
        sent: 0,
        failed: 0,
        errors: []
    };

    for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i];
        const recipientNumber = typeof recipient === 'string' ? recipient : recipient.number;
        const recipientName = typeof recipient === 'object' ? recipient.name : recipientNumber;

        try {
            // Validate phone number
            if (!validatePhoneNumber(recipientNumber)) {
                throw new Error('Invalid phone number format');
            }

            const formattedNumber = formatPhoneNumber(recipientNumber);

            // Check if number exists on WhatsApp
            const isRegistered = await client.isRegisteredUser(formattedNumber);
            if (!isRegistered) {
                throw new Error('Number not registered on WhatsApp');
            }

            // Generate message (support for template functions)
            const message = typeof messageTemplate === 'function'
                ? messageTemplate(recipient, i + 1)
                : messageTemplate;

            // Send message
            await client.sendMessage(formattedNumber, message);

            results.sent++;
            console.log(`✅ [${i + 1}/${recipients.length}] Sent to ${recipientName} (${recipientNumber})`);

            // Progress callback
            if (onProgress) {
                onProgress({
                    current: i + 1,
                    total: recipients.length,
                    recipient: recipientName,
                    status: 'success'
                });
            }

            // Wait before sending next message (except for the last message)
            if (i < recipients.length - 1) {
                console.log(`⏳ Waiting ${delaySeconds} seconds before next message...`);
                await sleep(delaySeconds);
            }

        } catch (error) {
            results.failed++;
            const errorMsg = `Failed to send to ${recipientName} (${recipientNumber}): ${error.message}`;
            results.errors.push(errorMsg);
            console.error(`❌ [${i + 1}/${recipients.length}] ${errorMsg}`);

            // Progress callback for failures
            if (onProgress) {
                onProgress({
                    current: i + 1,
                    total: recipients.length,
                    recipient: recipientName,
                    status: 'failed',
                    error: error.message
                });
            }

            // Continue to next recipient even if one fails
            if (i < recipients.length - 1) {
                await sleep(delaySeconds);
            }
        }
    }

    // Final summary
    console.log('\n=================================');
    console.log('📊 BULK MESSAGING SUMMARY');
    console.log('=================================');
    console.log(`✅ Successfully sent: ${results.sent}/${results.total}`);
    console.log(`❌ Failed: ${results.failed}/${results.total}`);

    if (results.errors.length > 0) {
        console.log('\n❌ Errors:');
        results.errors.forEach((error, index) => {
            console.log(`  ${index + 1}. ${error}`);
        });
    }

    console.log('=================================\n');

    return results;
}

/**
 * Send a message with media attachment
 * @param {Array} recipients - Array of recipients
 * @param {string} message - Message text
 * @param {string} mediaPath - Path to media file
 * @param {number} delaySeconds - Delay between messages
 */
async function sendBulkMediaMessages(recipients, message, mediaPath, delaySeconds = config.DEFAULT_DELAY_SECONDS) {
    const MessageMedia = require('whatsapp-web.js').MessageMedia;

    console.log('\n📨 Starting bulk media message sending...');
    console.log(`📊 Total recipients: ${recipients.length}`);
    console.log(`📎 Media file: ${mediaPath}\n`);

    const media = MessageMedia.fromFilePath(mediaPath);
    const results = {
        total: recipients.length,
        sent: 0,
        failed: 0,
        errors: []
    };

    for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i];
        const recipientNumber = typeof recipient === 'string' ? recipient : recipient.number;
        const recipientName = typeof recipient === 'object' ? recipient.name : recipientNumber;

        try {
            if (!validatePhoneNumber(recipientNumber)) {
                throw new Error('Invalid phone number format');
            }

            const formattedNumber = formatPhoneNumber(recipientNumber);
            const isRegistered = await client.isRegisteredUser(formattedNumber);

            if (!isRegistered) {
                throw new Error('Number not registered on WhatsApp');
            }

            await client.sendMessage(formattedNumber, media, { caption: message });

            results.sent++;
            console.log(`✅ [${i + 1}/${recipients.length}] Sent media to ${recipientName}`);

            if (i < recipients.length - 1) {
                console.log(`⏳ Waiting ${delaySeconds} seconds...`);
                await sleep(delaySeconds);
            }

        } catch (error) {
            results.failed++;
            const errorMsg = `Failed to send to ${recipientName}: ${error.message}`;
            results.errors.push(errorMsg);
            console.error(`❌ [${i + 1}/${recipients.length}] ${errorMsg}`);

            if (i < recipients.length - 1) {
                await sleep(delaySeconds);
            }
        }
    }

    console.log('\n=================================');
    console.log(`✅ Successfully sent: ${results.sent}/${results.total}`);
    console.log(`❌ Failed: ${results.failed}/${results.total}`);
    console.log('=================================\n');

    return results;
}

// QR Code event
client.on('qr', (qr) => {
    console.log('\n=================================');
    console.log('QR Code received! Scan with WhatsApp:');
    console.log('=================================\n');
    qrcode.generate(qr, { small: true });
    console.log('\nOpen WhatsApp on your phone > Settings > Linked Devices > Link a Device');
    console.log('Then scan the QR code above.\n');
});

// Client ready
client.on('ready', async () => {
    console.log('\n✅ WhatsApp Bot is ready!');
    console.log(`📱 Connected as: ${client.info.pushname}`);
    console.log('=================================\n');

    // EXAMPLE USAGE - Uncomment and modify as needed

    // Example 1: Simple text message to multiple numbers
    /*
    const recipients = [
        '1234567890',      // Phone number without country code
        '9876543210',
        // Add more numbers here
    ];
    
    const message = 'Hello! This is a test message from WhatsApp Bot.';
    const delaySeconds = 10; // 10 seconds delay between each message
    
    await sendBulkMessages(recipients, message, delaySeconds);
    */

    // Example 2: Personalized messages using recipient data
    /*
    const recipientsWithNames = [
        { number: '1234567890', name: 'John Doe' },
        { number: '9876543210', name: 'Jane Smith' },
        // Add more recipients here
    ];
    
    const personalizedMessage = (recipient, index) => {
        return `Hi ${recipient.name}! This is message #${index}. How are you today?`;
    };
    
    await sendBulkMessages(recipientsWithNames, personalizedMessage, 15);
    */

    // Example 3: Send bulk messages with media
    /*
    const recipients = ['1234567890', '9876543210'];
    const message = 'Check out this image!';
    const mediaPath = './image.jpg'; // Path to your media file
    
    await sendBulkMediaMessages(recipients, message, mediaPath, 10);
    */

    // Example 4: With progress tracking
    /*
    const recipients = ['1234567890', '9876543210'];
    const message = 'Hello from bulk sender!';
    
    await sendBulkMessages(recipients, message, 5, (progress) => {
        console.log(`Progress: ${progress.current}/${progress.total} - Status: ${progress.status}`);
    });
    */

    console.log('ℹ️  To use the bulk sender, uncomment the examples in bulkSender.js');
    console.log('ℹ️  Or import this file in your own script\n');
});

// Authentication events
client.on('authenticated', () => {
    console.log('✅ Authentication successful!');
});

client.on('auth_failure', (msg) => {
    console.error('❌ Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
    console.log('⚠️  Disconnected:', reason);
});

// Initialize client
client.initialize();

// Export functions for use in other scripts
module.exports = {
    client,
    sendBulkMessages,
    sendBulkMediaMessages,
    formatPhoneNumber,
    validatePhoneNumber
};
