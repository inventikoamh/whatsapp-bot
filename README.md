# WhatsApp Bulk Message Bot

A powerful WhatsApp bot built with Node.js and whatsapp-web.js that can send bulk messages with customizable delays.

## Features

✨ **Core Features:**
- 📤 Send bulk messages to multiple recipients
- ⏰ Configurable delay between messages (1-300 seconds)
- 🎯 Personalized messages using templates
- 📊 Progress tracking and detailed reporting
- 📎 Support for media messages (images, videos, documents)
- ✅ Phone number validation
- 🔐 Session persistence (no need to scan QR code every time)
- 📱 WhatsApp number verification before sending

## Prerequisites

- Node.js (version 18 or higher)
- A phone number with WhatsApp installed
- Active internet connection

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd whatsapp-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Quick Start

### Option 1: Using the Main Bot (Simple Authentication)

1. **Start the bot for first-time authentication:**
   ```bash
   node index.js
   ```

2. **Scan the QR code** that appears in your terminal using WhatsApp on your phone:
   - Open WhatsApp on your phone
   - Go to Settings → Linked Devices
   - Tap "Link a Device"
   - Scan the QR code from the terminal

3. **Session saved!** Next time you run the bot, it will use the saved session (no QR code needed).

### Option 2: Using the Bulk Sender

1. **For bulk messaging with examples:**
   ```bash
   node bulkSender.js
   ```

2. **Uncomment the examples** in `bulkSender.js` (around line 225) and add your recipient numbers.

### Option 3: Using the Example Script

1. **Edit the example script:**
   ```bash
   # Open example.js and modify the recipients array
   ```

2. **Run the example:**
   ```bash
   node example.js
   ```

## Usage Examples

### Example 1: Simple Bulk Message

```javascript
const { sendBulkMessages } = require('./bulkSender');

// Wait for client to be ready (in ready event handler)
const recipients = [
    '9876543210',  // India number without country code
    '9123456789',
];

const message = 'Hello! This is a test message.';
const delaySeconds = 10; // 10 seconds between messages

await sendBulkMessages(recipients, message, delaySeconds);
```

### Example 2: Personalized Messages

```javascript
const recipients = [
    { number: '9876543210', name: 'John', city: 'Mumbai' },
    { number: '9123456789', name: 'Jane', city: 'Delhi' },
];

const messageTemplate = (recipient, messageNumber) => {
    return `Hi ${recipient.name} from ${recipient.city}!
    
This is message #${messageNumber}.
Have a great day!`;
};

await sendBulkMessages(recipients, messageTemplate, 15);
```

### Example 3: With Progress Tracking

```javascript
await sendBulkMessages(recipients, message, 10, (progress) => {
    console.log(`Progress: ${progress.current}/${progress.total}`);
    console.log(`Status: ${progress.status}`);
    console.log(`Recipient: ${progress.recipient}`);
});
```

### Example 4: Sending Media Messages

```javascript
const { sendBulkMediaMessages } = require('./bulkSender');

const recipients = ['9876543210', '9123456789'];
const message = 'Check out this image!';
const mediaPath = './image.jpg'; // or './document.pdf', './video.mp4'

await sendBulkMediaMessages(recipients, message, mediaPath, 10);
```

## Configuration

Edit `config.js` to customize settings:

```javascript
module.exports = {
    DEFAULT_DELAY_SECONDS: 5,     // Default delay between messages
    SESSION_PATH: './session',     // Where to save session data
    MAX_DELAY_SECONDS: 300,        // Maximum allowed delay (5 min)
    MIN_DELAY_SECONDS: 1,          // Minimum allowed delay (1 sec)
    MAX_RETRIES: 3,                // Retry attempts for failed messages
    RETRY_DELAY_MS: 2000          // Delay between retries
};
```

## Phone Number Format

The bot automatically handles phone number formatting. You can provide numbers in various formats:

- `9876543210` - Will add country code automatically (default: India +91)
- `919876543210` - With country code
- `+91 9876543210` - With country code and symbols
- `(91) 98765-43210` - With formatting (will be cleaned)

**To change the default country code**, edit the `formatPhoneNumber` function in `bulkSender.js`:

```javascript
// Change this line for your country code
if (!cleaned.startsWith('91') && cleaned.length === 10) {
    cleaned = '91' + cleaned; // Change 91 to your country code
}
```

## Project Structure

```
whatsapp-bot/
├── index.js           # Basic bot with authentication
├── bulkSender.js      # Main bulk messaging functionality
├── example.js         # Example usage scripts
├── config.js          # Configuration settings
├── package.json       # Dependencies
├── README.md          # Documentation
└── session/           # Auto-generated session data (don't share!)
```

## Important Notes

⚠️ **Safety & Best Practices:**

1. **Rate Limiting**: Use appropriate delays (recommended: 10-15 seconds) to avoid being flagged by WhatsApp
2. **Message Limits**: WhatsApp may temporarily block accounts that send too many messages
3. **Recipients**: Only send messages to people who have opted in
4. **Testing**: Always test with a small group first
5. **Session Security**: Never share your `session/` folder - it contains your authentication data

## Features Explained

### 1. Session Persistence
- After first QR code scan, session is saved
- No need to scan QR code on subsequent runs
- Session files stored in `./session` directory

### 2. Number Validation
- Automatically validates phone numbers
- Checks if numbers are registered on WhatsApp
- Prevents sending to invalid numbers

### 3. Error Handling
- Continues sending even if some messages fail
- Detailed error reporting at the end
- Retry mechanism for failed messages

### 4. Progress Tracking
- Real-time progress updates
- Success/failure counters
- Optional callback for custom tracking

## Troubleshooting

### QR Code Not Appearing
- Make sure your terminal supports QR code rendering
- Try using a terminal with better Unicode support
- Check that you have internet connection

### Authentication Failed
- Delete the `session/` folder
- Run the bot again and scan a fresh QR code
- Make sure WhatsApp is active on your phone

### Messages Not Sending
- Verify the recipient numbers are correct
- Check if numbers are registered on WhatsApp
- Ensure you're not exceeding WhatsApp's rate limits
- Increase the delay between messages

### "Number not registered on WhatsApp"
- The recipient doesn't have WhatsApp
- The number format might be incorrect
- Check country code in the number

## Advanced Usage

### Creating Your Own Script

```javascript
// myCustomScript.js
const { client, sendBulkMessages } = require('./bulkSender');

// Wait for client to be ready
client.on('ready', async () => {
    console.log('Bot is ready!');
    
    // Your custom logic here
    const recipients = [...]; // Your recipients
    const message = '...';     // Your message
    
    const results = await sendBulkMessages(recipients, message, 15);
    
    console.log('Sent:', results.sent);
    console.log('Failed:', results.failed);
});
```

### Importing from CSV

```javascript
const fs = require('fs');
const csv = require('csv-parser');

const recipients = [];

fs.createReadStream('recipients.csv')
    .pipe(csv())
    .on('data', (row) => {
        recipients.push({
            number: row.phone,
            name: row.name
        });
    })
    .on('end', async () => {
        await sendBulkMessages(recipients, messageTemplate, 10);
    });
```

## Security Considerations

🔒 **Keep Your Bot Secure:**

1. Never share your `session/` folder
2. Don't commit session files to version control
3. Add `session/` to `.gitignore`
4. Use environment variables for sensitive data
5. Keep your Node.js and dependencies updated

## Dependencies

- **whatsapp-web.js**: WhatsApp Web API wrapper
- **qrcode-terminal**: Display QR codes in terminal
- **puppeteer**: Automated browser control (installed with whatsapp-web.js)

## Support

For issues and questions:
1. Check the [whatsapp-web.js documentation](https://wwebjs.dev)
2. Review the troubleshooting section above
3. Check your code for syntax errors

## License

ISC

## Disclaimer

This bot is not affiliated with WhatsApp or Meta. Use responsibly and in accordance with WhatsApp's Terms of Service. The developers are not responsible for any misuse of this software.

---

**Happy Messaging! 📱✨**
