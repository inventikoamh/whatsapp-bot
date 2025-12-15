/**
 * Complete Demo Script
 * Demonstrates all major features of the WhatsApp Bulk Sender
 */

const { client, sendBulkMessages, sendBulkMediaMessages } = require('./bulkSender');
const utils = require('./utils');

// Sample data
const sampleRecipients = [
    { number: '9876543210', name: 'Alice', company: 'Tech Corp' },
    { number: '9123456789', name: 'Bob', company: 'Design Co' },
    { number: '9555555555', name: 'Charlie', company: 'Marketing Inc' }
];

async function runDemo() {
    console.log('\n' + '='.repeat(60));
    console.log('  WHATSAPP BULK SENDER - COMPLETE DEMO');
    console.log('='.repeat(60) + '\n');

    // Show available demos
    console.log('📋 Available Demos:\n');
    console.log('  1️⃣  Simple text message to all');
    console.log('  2️⃣  Personalized messages with templates');
    console.log('  3️⃣  Progress tracking demo');
    console.log('  4️⃣  Time estimation');
    console.log('  5️⃣  Batch processing');
    console.log('  6️⃣  Create sample CSV file');
    console.log('\n' + '='.repeat(60) + '\n');

    // Uncomment the demo you want to run:

    // await demo1_SimpleMessage();
    // await demo2_PersonalizedMessages();
    // await demo3_ProgressTracking();
    // await demo4_TimeEstimation();
    // await demo5_BatchProcessing();
    // demo6_CreateSampleCSV();

    console.log('ℹ️  Uncomment a demo function above to run it!\n');
}

/**
 * Demo 1: Simple message to all recipients
 */
async function demo1_SimpleMessage() {
    console.log('\n🎯 DEMO 1: Simple Message\n');

    const message = `Hello! 👋

This is a test message from the WhatsApp Bulk Sender Bot.

Have a great day!`;

    const results = await sendBulkMessages(sampleRecipients, message, 5);

    // Save results to log
    utils.saveResultsToLog(results);

    // Display statistics
    const stats = utils.getStatistics(results);
    console.log('\n📊 Statistics:', stats);
}

/**
 * Demo 2: Personalized messages using template
 */
async function demo2_PersonalizedMessages() {
    console.log('\n🎯 DEMO 2: Personalized Messages\n');

    const messageTemplate = (recipient, messageNumber) => {
        const msgId = utils.generateMessageId();

        return `Hi ${recipient.name}! 👋

Company: ${recipient.company}
Message Number: ${messageNumber}
Reference ID: ${msgId}

This is a personalized message just for you!

Best regards,
Your Team`;
    };

    const results = await sendBulkMessages(sampleRecipients, messageTemplate, 8);

    console.log('\n✅ Personalized messages sent!');
    console.log('Statistics:', utils.getStatistics(results));
}

/**
 * Demo 3: Progress tracking with visual feedback
 */
async function demo3_ProgressTracking() {
    console.log('\n🎯 DEMO 3: Progress Tracking\n');

    const message = 'Hello! This message includes progress tracking.';
    const sentList = [];
    const failedList = [];

    const results = await sendBulkMessages(
        sampleRecipients,
        message,
        6,
        (progress) => {
            // Create progress bar
            const progressBar = utils.createProgressBar(
                progress.current,
                progress.total
            );

            console.log(progressBar);

            if (progress.status === 'success') {
                sentList.push(progress.recipient);
            } else {
                failedList.push({
                    recipient: progress.recipient,
                    error: progress.error
                });
            }
        }
    );

    // Display summary table
    console.log('\n📊 Delivery Summary:');
    utils.displayTable(
        [
            { Status: 'Sent', Count: sentList.length },
            { Status: 'Failed', Count: failedList.length },
            { Status: 'Total', Count: sampleRecipients.length }
        ],
        ['Status', 'Count']
    );
}

/**
 * Demo 4: Time estimation before sending
 */
async function demo4_TimeEstimation() {
    console.log('\n🎯 DEMO 4: Time Estimation\n');

    const delaySeconds = 10;
    const estimate = utils.estimateCompletionTime(
        sampleRecipients.length,
        delaySeconds
    );

    console.log('📊 Campaign Details:');
    console.log(`   Recipients: ${sampleRecipients.length}`);
    console.log(`   Delay: ${delaySeconds} seconds`);
    console.log(`   Estimated Duration: ${estimate.duration}`);
    console.log(`   Expected Completion: ${estimate.estimatedCompletion}\n`);

    // Uncomment to actually send:
    // const message = 'This campaign was pre-calculated!';
    // await sendBulkMessages(sampleRecipients, message, delaySeconds);

    console.log('✅ Time calculation complete!');
    console.log('   (Uncomment the send command to actually send messages)\n');
}

/**
 * Demo 5: Batch processing for large lists
 */
async function demo5_BatchProcessing() {
    console.log('\n🎯 DEMO 5: Batch Processing\n');

    const batchSize = 2;
    const delayBetweenBatches = 10;

    console.log(`Processing ${sampleRecipients.length} recipients in batches of ${batchSize}\n`);

    for (let i = 0; i < sampleRecipients.length; i += batchSize) {
        const batch = sampleRecipients.slice(i, i + batchSize);
        const batchNumber = Math.floor(i / batchSize) + 1;
        const totalBatches = Math.ceil(sampleRecipients.length / batchSize);

        console.log(`\n📦 Batch ${batchNumber}/${totalBatches}`);
        console.log(`   Recipients in this batch: ${batch.length}`);

        const message = `Hello! This is batch ${batchNumber} of ${totalBatches}.`;

        // Uncomment to actually send:
        // await sendBulkMessages(batch, message, 5);

        console.log(`   ✅ Batch ${batchNumber} completed!`);

        if (i + batchSize < sampleRecipients.length) {
            console.log(`   ⏸️  Waiting ${delayBetweenBatches} seconds before next batch...`);
            // Uncomment to actually wait:
            // await utils.sleep(delayBetweenBatches);
        }
    }

    console.log('\n✅ All batches processed!');
    console.log('   (Uncomment the send and sleep commands to actually send)\n');
}

/**
 * Demo 6: Create sample CSV file
 */
function demo6_CreateSampleCSV() {
    console.log('\n🎯 DEMO 6: Create Sample CSV\n');

    utils.createSampleCSV('sample_recipients.csv');

    console.log('\n📝 CSV file created successfully!');
    console.log('   You can now edit it with your recipient data.');
    console.log('   Format: number,name,company,email\n');

    console.log('💡 To import and use the CSV:');
    console.log('   const recipients = await utils.parseCSV("sample_recipients.csv");');
    console.log('   await sendBulkMessages(recipients, message, 10);\n');
}

// Wait for WhatsApp client to be ready
client.on('ready', async () => {
    console.log('✅ WhatsApp client ready!\n');

    try {
        await runDemo();
    } catch (error) {
        console.error('❌ Error running demo:', error);
    }
});

console.log('⏳ Initializing WhatsApp client...');
console.log('📱 Scan QR code when it appears...\n');
