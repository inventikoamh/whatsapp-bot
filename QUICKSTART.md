# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start the Bot
```bash
npm start
# or
node index.js
```

### Step 2: Scan QR Code
- A QR code will appear in your terminal
- Open WhatsApp on your phone
- Go to: **Settings → Linked Devices → Link a Device**
- Scan the QR code

### Step 3: Send Messages
Once authenticated, choose one of these options:

#### Option A: Basic Bulk Sender
```bash
npm run bulk
```
Then uncomment and edit the examples in `bulkSender.js`

#### Option B: Simple Examples
```bash
npm run example
```
Uncomment the example you want in `example.js`

#### Option C: Advanced Features
```bash
npm run advanced
```
Try advanced features like batch processing and scheduling in `advancedExample.js`

---

## 📝 Quick Code Example

Create a new file `my-campaign.js`:

```javascript
const { client, sendBulkMessages } = require('./bulkSender');

client.on('ready', async () => {
    console.log('Bot ready!');
    
    // Your recipients
    const recipients = [
        { number: '9876543210', name: 'John' },
        { number: '9123456789', name: 'Jane' }
    ];
    
    // Your message
    const message = (recipient) => {
        return `Hi ${recipient.name}! This is a test message.`;
    };
    
    // Send with 10 second delay
    await sendBulkMessages(recipients, message, 10);
    
    console.log('Done! Press Ctrl+C to exit.');
});
```

Then run:
```bash
node my-campaign.js
```

---

## ⚙️ Configuration

Edit `config.js` to change:
- Default delay between messages
- Session storage path
- Min/Max delay limits
- Retry settings

---

## 📊 Features at a Glance

| Feature | File to Edit |
|---------|-------------|
| Simple messages | `example.js` |
| Bulk sending | `bulkSender.js` |
| Batch processing | `advancedExample.js` |
| Media messages | `bulkSender.js` (Example 4) |
| Scheduled sending | `advancedExample.js` (Example 4) |
| CSV import | Use `utils.parseCSV()` |

---

## 🆘 Common Issues

### QR Code not showing?
- Your terminal might not support Unicode
- Try Windows Terminal or another modern terminal

### "Authentication failed"?
```bash
# Delete session and try again
rmdir /s session
node index.js
```

### Number format issues?
```javascript
// Edit formatPhoneNumber in bulkSender.js
// Change the country code (default is 91 for India)
if (!cleaned.startsWith('91') && cleaned.length === 10) {
    cleaned = '1' + cleaned; // Change to your country code
}
```

---

## 📚 Learn More

- Full documentation: `README.md`
- Example scripts: `example.js` and `advancedExample.js`
- Official docs: https://wwebjs.dev

---

**Happy messaging! 🎉**
