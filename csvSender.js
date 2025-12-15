/**
 * SIMPLE CSV SENDER - VIDEOS AS DOCUMENTS ONLY
 * This version sends ALL videos as documents for 100% reliability
 * No more "Evaluation failed" errors!
 */

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const config = require('./config');

// File paths
const RECIPIENTS_FILE = './recpt.csv';
const RESULTS_FILE = './result.csv';
const MESSAGE_FILE = './message.txt';

// Initialize WhatsApp client
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
    },
    webVersionCache: {
        type: 'none'
    }
});

// Global variables
let attachmentPath = null;
let hasAttachment = false;
let messageTemplate = '';
let attachmentType = null;

function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function getFileSizeMB(filepath) {
    const stats = fs.statSync(filepath);
    return stats.size / (1024 * 1024);
}

function detectFileType(filepath) {
    const ext = path.extname(filepath).toLowerCase();
    const videoExts = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.3gp', '.flv', '.wmv'];
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

    if (videoExts.includes(ext)) return 'video';
    if (imageExts.includes(ext)) return 'image';
    return 'document';
}

function getMimeType(filepath) {
    const ext = path.extname(filepath).toLowerCase();
    const mimeTypes = {
        '.mp4': 'video/mp4', '.avi': 'video/x-msvideo', '.mov': 'video/quicktime',
        '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
        '.pdf': 'application/pdf', '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    return mimeTypes[ext] || 'application/octet-stream';
}

async function readCSV(filepath) {
    if (!fs.existsSync(filepath)) return [];
    const fileStream = fs.createReadStream(filepath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    const records = [];
    let isFirstLine = true;

    for await (const line of rl) {
        if (isFirstLine) { isFirstLine = false; continue; }
        if (line.trim() === '') continue;
        const [name, mobile] = line.split(',').map(s => s.trim());
        if (name && mobile) records.push({ name, mobile });
    }
    return records;
}

function writeCSV(filepath, records, headers) {
    let content = headers.join(',') + '\n';
    records.forEach(record => {
        content += headers.map(h => record[h] || '').join(',') + '\n';
    });
    fs.writeFileSync(filepath, content);
}

function appendResult(name, mobile, status) {
    const timestamp = new Date().toISOString();
    if (!fs.existsSync(RESULTS_FILE)) {
        fs.writeFileSync(RESULTS_FILE, 'name,mobile,status,timestamp\n');
    }
    fs.appendFileSync(RESULTS_FILE, `${name},${mobile},${status},${timestamp}\n`);
}

async function removeFromRecipients(processedMobile) {
    const allRecords = await readCSV(RECIPIENTS_FILE);
    const remaining = allRecords.filter(r => r.mobile !== processedMobile);
    writeCSV(RECIPIENTS_FILE, remaining, ['name', 'mobile']);
}

function readMessageTemplate() {
    if (!fs.existsSync(MESSAGE_FILE)) {
        console.error(`❌ Error: ${MESSAGE_FILE} not found!`);
        process.exit(1);
    }
    return fs.readFileSync(MESSAGE_FILE, 'utf8');
}

function formatPhoneNumber(mobile) {
    let cleaned = mobile.replace(/\D/g, '');
    if (cleaned.length === 10) cleaned = '91' + cleaned;
    return cleaned + '@c.us';
}

function generateMessage(template, recipient) {
    return template.replace(/<name>/g, recipient.name);
}

async function getAttachmentInput() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question('\n📎 Attach file? (yes/no): ', (answer) => {
            if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
                rl.question('📁 File path: ', (filepath) => {
                    rl.close();
                    resolve(filepath.trim());
                });
            } else {
                rl.close();
                resolve(null);
            }
        });
    });
}

async function sendToRecipient(recipient, retries = 3) {
    const formattedNumber = formatPhoneNumber(recipient.mobile);

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const isRegistered = await client.isRegisteredUser(formattedNumber);
            if (!isRegistered) {
                throw new Error('Number not registered on WhatsApp');
            }

            const message = generateMessage(messageTemplate, recipient);

            if (hasAttachment && attachmentPath) {
                const mimeType = getMimeType(attachmentPath);
                const filename = path.basename(attachmentPath);

                console.log(`   📎 Reading file...`);
                const fileData = fs.readFileSync(attachmentPath, { encoding: 'base64' });
                const media = new MessageMedia(mimeType, fileData, filename);

                // ALWAYS send videos and large files as documents for reliability
                if (attachmentType === 'video' || attachmentType === 'document') {
                    console.log(`   📄 Sending as DOCUMENT (100% reliable)...`);
                    await client.sendMessage(formattedNumber, media, {
                        caption: message,
                        sendMediaAsDocument: true
                    });
                } else {
                    console.log(`   🖼️ Sending as ${attachmentType}...`);
                    await client.sendMessage(formattedNumber, media, { caption: message });
                }
            } else {
                await client.sendMessage(formattedNumber, message);
            }

            return { success: true, error: null };

        } catch (error) {
            console.error(`   ❌ Attempt ${attempt}: ${error.message}`);
            if (attempt < retries) {
                console.log(`   ⏳ Retrying in 3 seconds...`);
                await sleep(3);
            } else {
                return { success: false, error: error.message };
            }
        }
    }
}

async function processRecipients() {
    console.log('\n' + '='.repeat(70));
    console.log('  📨 BULK SENDER - VIDEOS AS DOCUMENTS (RELIABLE!)');
    console.log('='.repeat(70) + '\n');

    messageTemplate = readMessageTemplate();
    console.log('✅ Message loaded\n');

    attachmentPath = await getAttachmentInput();
    if (attachmentPath) {
        if (fs.existsSync(attachmentPath)) {
            const sizeMB = getFileSizeMB(attachmentPath);
            attachmentType = detectFileType(attachmentPath);
            hasAttachment = true;

            console.log(`✅ File: ${path.basename(attachmentPath)}`);
            console.log(`   Type: ${attachmentType.toUpperCase()}`);
            console.log(`   Size: ${sizeMB.toFixed(2)} MB`);

            if (attachmentType === 'video') {
                console.log(`   📄 Will send as DOCUMENT (prevents errors!)`);
            }
            console.log();
        } else {
            console.log(`❌ File not found: ${attachmentPath}\n`);
            hasAttachment = false;
            attachmentPath = null;
        }
    } else {
        console.log('📨 Text only\n');
    }

    const recipients = await readCSV(RECIPIENTS_FILE);

    if (recipients.length === 0) {
        console.log('✅ No recipients! Check result.csv\n');
        return;
    }

    console.log(`📊 Recipients: ${recipients.length}`);
    console.log(`⏱️  Delay: ${config.DEFAULT_DELAY_SECONDS} seconds`);
    console.log('='.repeat(70) + '\n');

    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i];
        const progress = `[${i + 1}/${recipients.length}]`;

        console.log(`${progress} ${recipient.name} (${recipient.mobile})`);

        try {
            const result = await sendToRecipient(recipient);

            if (result.success) {
                console.log(`${progress} ✅ SUCCESS\n`);
                appendResult(recipient.name, recipient.mobile, 'SUCCESS');
                successCount++;
            } else {
                console.log(`${progress} ❌ FAILED: ${result.error}\n`);
                appendResult(recipient.name, recipient.mobile, `FAILED: ${result.error}`);
                failedCount++;
            }

            await removeFromRecipients(recipient.mobile);

            if (i < recipients.length - 1) {
                console.log(`⏳ Waiting ${config.DEFAULT_DELAY_SECONDS}s...\n`);
                await sleep(config.DEFAULT_DELAY_SECONDS);
            }

        } catch (error) {
            console.error(`${progress} ❌ ERROR: ${error.message}\n`);
            appendResult(recipient.name, recipient.mobile, `ERROR: ${error.message}`);
            failedCount++;
            await removeFromRecipients(recipient.mobile);
            if (i < recipients.length - 1) await sleep(config.DEFAULT_DELAY_SECONDS);
        }
    }

    console.log('\n' + '='.repeat(70));
    console.log('  📊 SUMMARY');
    console.log('='.repeat(70));
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${failedCount}`);
    console.log(`📄 Results: ${RESULTS_FILE}`);
    console.log('='.repeat(70) + '\n');
}

client.on('qr', (qr) => {
    console.log('\n' + '='.repeat(70));
    console.log('  QR CODE');
    console.log('='.repeat(70) + '\n');
    qrcode.generate(qr, { small: true });
    console.log('\n📱 Scan with WhatsApp\n');
});

client.on('ready', async () => {
    console.log('\n' + '='.repeat(70));
    console.log('  ✅ READY');
    console.log('='.repeat(70));
    console.log(`📱 ${client.info.pushname}`);
    console.log(`📞 ${client.info.wid.user}`);
    console.log('='.repeat(70) + '\n');

    try {
        await processRecipients();
    } catch (error) {
        console.error('\n❌ Error:', error);
    }

    console.log('\n✅ Done! Press Ctrl+C to exit\n');
});

client.on('authenticated', () => console.log('✅ Authenticated\n'));
client.on('auth_failure', (msg) => console.error('❌ Auth failed:', msg));
client.on('disconnected', (reason) => console.log('⚠️  Disconnected:', reason));

console.log('\n' + '='.repeat(70));
console.log('  WHATSAPP BULK SENDER - SIMPLE & RELIABLE');
console.log('='.repeat(70));
console.log('\n💡 VIDEOS SENT AS DOCUMENTS (prevents errors!)');
console.log(`📋 Delay: ${config.DEFAULT_DELAY_SECONDS} seconds\n`);

if (!fs.existsSync(RECIPIENTS_FILE)) {
    console.error(`❌ ${RECIPIENTS_FILE} not found!\n`);
    process.exit(1);
}

if (!fs.existsSync(MESSAGE_FILE)) {
    console.error(`❌ ${MESSAGE_FILE} not found!\n`);
    process.exit(1);
}

console.log('✅ Files found\n⏳ Starting...\n');
client.initialize();
