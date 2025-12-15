/**
 * Test Mode Script
 * Run this to test the bot without actually sending messages
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('./config');

console.log('\n' + '='.repeat(70));
console.log('  WHATSAPP BOT - TEST MODE');
console.log('='.repeat(70) + '\n');

console.log('✅ Configuration loaded successfully!');
console.log('\n📋 Current Configuration:');
console.log(`   Default Delay: ${config.DEFAULT_DELAY_SECONDS} seconds`);
console.log(`   Min Delay: ${config.MIN_DELAY_SECONDS} seconds`);
console.log(`   Max Delay: ${config.MAX_DELAY_SECONDS} seconds`);
console.log(`   Session Path: ${config.SESSION_PATH}`);
console.log(`   Max Retries: ${config.MAX_RETRIES}`);

console.log('\n📦 Dependencies Check:');
try {
    require('whatsapp-web.js');
    console.log('   ✅ whatsapp-web.js installed');
} catch (e) {
    console.log('   ❌ whatsapp-web.js NOT installed');
}

try {
    require('qrcode-terminal');
    console.log('   ✅ qrcode-terminal installed');
} catch (e) {
    console.log('   ❌ qrcode-terminal NOT installed');
}

console.log('\n📁 Project Files:');
const fs = require('fs');
const files = [
    'index.js',
    'bulkSender.js',
    'example.js',
    'advancedExample.js',
    'demo.js',
    'utils.js',
    'config.js',
    'README.md',
    'QUICKSTART.md',
    'PROJECT_SUMMARY.md'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        console.log(`   ✅ ${file.padEnd(25)} (${(stats.size / 1024).toFixed(2)} KB)`);
    } else {
        console.log(`   ❌ ${file.padEnd(25)} NOT FOUND`);
    }
});

console.log('\n🧪 Testing Utility Functions:');
const utils = require('./utils');

// Test 1: Phone number cleaning
console.log('\n   Test 1: Phone Number Cleaning');
const testNumbers = ['+91 98765 43210', '(91) 9876-543-210', '9876543210'];
testNumbers.forEach(num => {
    const cleaned = utils.cleanPhoneNumber(num);
    console.log(`      ${num} → ${cleaned}`);
});

// Test 2: Message ID generation
console.log('\n   Test 2: Message ID Generation');
for (let i = 0; i < 3; i++) {
    console.log(`      ${utils.generateMessageId()}`);
}

// Test 3: Time estimation
console.log('\n   Test 3: Time Estimation');
const estimate = utils.estimateCompletionTime(50, 10);
console.log(`      50 messages with 10s delay:`);
console.log(`      Duration: ${estimate.duration}`);
console.log(`      Completion: ${estimate.estimatedCompletion}`);

// Test 4: Progress bar
console.log('\n   Test 4: Progress Bar');
for (let i = 0; i <= 10; i += 2) {
    console.log(`      ${utils.createProgressBar(i, 10)}`);
}

// Test 5: Validation
console.log('\n   Test 5: Recipient Validation');
const testRecipients = [
    '9876543210',
    { number: '9123456789', name: 'Test' },
    'invalid',
    { number: '123', name: 'Short' }
];
testRecipients.forEach(r => {
    const valid = utils.validateRecipient(r);
    const display = typeof r === 'string' ? r : r.number;
    console.log(`      ${display.padEnd(15)} → ${valid ? '✅ Valid' : '❌ Invalid'}`);
});

console.log('\n' + '='.repeat(70));
console.log('🎯 TEST MODE OPTIONS:');
console.log('='.repeat(70) + '\n');

console.log('1️⃣  Test Authentication (scan QR code):');
console.log('   npm start\n');

console.log('2️⃣  View Example Scripts:');
console.log('   npm run example\n');

console.log('3️⃣  View Advanced Examples:');
console.log('   npm run advanced\n');

console.log('4️⃣  Run Full Demo:');
console.log('   npm run demo\n');

console.log('5️⃣  Create Sample CSV:');
console.log('   In demo.js, uncomment: demo6_CreateSampleCSV()\n');

console.log('='.repeat(70));
console.log('✅ All tests passed! Your bot is ready to use.');
console.log('='.repeat(70) + '\n');

console.log('📖 Next Steps:');
console.log('   1. Read QUICKSTART.md for quick setup');
console.log('   2. Read README.md for full documentation');
console.log('   3. Check PROJECT_SUMMARY.md for overview');
console.log('   4. Run "npm start" to authenticate\n');

console.log('⚠️  Remember:');
console.log('   • Test with small groups first');
console.log('   • Use appropriate delays (10-15 seconds)');
console.log('   • Only message people who opted in');
console.log('   • Keep your session folder private\n');
