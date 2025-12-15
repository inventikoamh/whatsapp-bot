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

// Generate QR code for authentication
client.on('qr', (qr) => {
    console.log('\n=================================');
    console.log('QR Code received! Scan with WhatsApp:');
    console.log('=================================\n');
    qrcode.generate(qr, { small: true });
    console.log('\nOpen WhatsApp on your phone > Settings > Linked Devices > Link a Device');
    console.log('Then scan the QR code above.\n');
});

// Client is ready
client.on('ready', () => {
    console.log('\n✅ WhatsApp Bot is ready!');
    console.log(`📱 Connected as: ${client.info.pushname}`);
    console.log(`📞 Phone number: ${client.info.wid.user}`);
    console.log('=================================\n');
    console.log('You can now use the bulk messaging functions.');
    console.log('Check bulkSender.js for examples.\n');
});

// Authentication successful
client.on('authenticated', () => {
    console.log('✅ Authentication successful!');
});

// Authentication failure
client.on('auth_failure', (msg) => {
    console.error('❌ Authentication failed:', msg);
    console.log('Please delete the session folder and try again.');
});

// Client disconnected
client.on('disconnected', (reason) => {
    console.log('⚠️  Client was disconnected:', reason);
});

// Handle incoming messages (optional - for interactive features)
client.on('message', async (message) => {
    // You can add auto-reply or command handling here
    // Example: if (message.body === '!ping') { message.reply('pong'); }
});

// Initialize the client
client.initialize();

// Export client for use in other files
module.exports = client;
