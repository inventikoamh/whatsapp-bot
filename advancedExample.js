// Advanced example with CSV import and scheduling
const { client, sendBulkMessages, sendBulkMediaMessages } = require('./bulkSender');

/**
 * Example: Load recipients from array/object
 */
function getRecipientsFromData() {
    return [
        {
            number: '9876543210',
            name: 'Alice Johnson',
            company: 'Tech Corp',
            email: 'alice@example.com'
        },
        {
            number: '9123456789',
            name: 'Bob Smith',
            company: 'Design Studio',
            email: 'bob@example.com'
        },
        // Add more recipients here
    ];
}

/**
 * Example: Advanced message template with conditional logic
 */
function createAdvancedMessage(recipient, index) {
    const greeting = getTimeBasedGreeting();
    const emoji = index % 2 === 0 ? '🌟' : '✨';

    return `${greeting} ${recipient.name}! ${emoji}

I hope this message finds you well.

Company: ${recipient.company}
Reference: MSG-${String(index).padStart(4, '0')}

Thank you for your time!

Best regards,
Your Team

---
Message ${index} - ${new Date().toLocaleDateString()}`;
}

/**
 * Get greeting based on time of day
 */
function getTimeBasedGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

/**
 * Example: Batch processing with groups
 */
async function sendInBatches(allRecipients, batchSize = 10, delayBetweenBatches = 60) {
    console.log(`\n📦 Processing ${allRecipients.length} recipients in batches of ${batchSize}`);

    for (let i = 0; i < allRecipients.length; i += batchSize) {
        const batch = allRecipients.slice(i, i + batchSize);
        const batchNumber = Math.floor(i / batchSize) + 1;
        const totalBatches = Math.ceil(allRecipients.length / batchSize);

        console.log(`\n📨 Processing Batch ${batchNumber}/${totalBatches}`);

        await sendBulkMessages(batch, createAdvancedMessage, 10);

        // Wait between batches (except for the last batch)
        if (i + batchSize < allRecipients.length) {
            console.log(`\n⏸️  Waiting ${delayBetweenBatches} seconds before next batch...\n`);
            await new Promise(resolve => setTimeout(resolve, delayBetweenBatches * 1000));
        }
    }

    console.log('\n✅ All batches completed!');
}

/**
 * Example: Scheduled sending
 */
async function scheduleMessage(recipients, message, delaySeconds, scheduledTime) {
    const now = new Date();
    const scheduled = new Date(scheduledTime);
    const waitMs = scheduled - now;

    if (waitMs < 0) {
        console.log('⚠️  Scheduled time is in the past. Sending immediately...');
        return await sendBulkMessages(recipients, message, delaySeconds);
    }

    console.log(`⏰ Messages scheduled for: ${scheduled.toLocaleString()}`);
    console.log(`⏳ Waiting ${Math.round(waitMs / 1000 / 60)} minutes...\n`);

    setTimeout(async () => {
        console.log('🚀 Starting scheduled message delivery...');
        await sendBulkMessages(recipients, message, delaySeconds);
    }, waitMs);
}

/**
 * Example: Filter recipients based on criteria
 */
function filterRecipients(recipients, filterFn) {
    return recipients.filter(filterFn);
}

/**
 * Example: Generate daily report message
 */
function createDailyReport(recipient, stats) {
    return `📊 Daily Report for ${recipient.name}

Date: ${new Date().toLocaleDateString()}

Summary:
• Total Items: ${stats.total}
• Completed: ${stats.completed}
• Pending: ${stats.pending}

Status: ${stats.status}

Have a great day!`;
}

// Wait for client to be ready
client.on('ready', async () => {
    console.log('\n🚀 Advanced Examples Ready!\n');

    try {
        // ============================================
        // EXAMPLE 1: Send with time-based greetings
        // ============================================
        /*
        const recipients = getRecipientsFromData();
        await sendBulkMessages(recipients, createAdvancedMessage, 10);
        */

        // ============================================
        // EXAMPLE 2: Batch processing
        // ============================================
        /*
        const allRecipients = getRecipientsFromData();
        await sendInBatches(allRecipients, 5, 30); // 5 per batch, 30 sec between batches
        */

        // ============================================
        // EXAMPLE 3: Filtered recipients
        // ============================================
        /*
        const allRecipients = getRecipientsFromData();
        
        // Send only to specific company
        const techCompanyRecipients = filterRecipients(
            allRecipients, 
            r => r.company.includes('Tech')
        );
        
        await sendBulkMessages(
            techCompanyRecipients, 
            'Special message for Tech companies!', 
            10
        );
        */

        // ============================================
        // EXAMPLE 4: Scheduled sending
        // ============================================
        /*
        const recipients = getRecipientsFromData();
        const message = 'This message was scheduled!';
        
        // Schedule for specific time (example: 2:30 PM today)
        const scheduledTime = new Date();
        scheduledTime.setHours(14, 30, 0, 0);
        
        await scheduleMessage(recipients, message, 10, scheduledTime);
        */

        // ============================================
        // EXAMPLE 5: Daily reports
        // ============================================
        /*
        const recipients = getRecipientsFromData();
        
        const reportMessage = (recipient) => {
            const stats = {
                total: 100,
                completed: 75,
                pending: 25,
                status: 'On Track'
            };
            return createDailyReport(recipient, stats);
        };
        
        await sendBulkMessages(recipients, reportMessage, 15);
        */

        // ============================================
        // EXAMPLE 6: Mix of text and media
        // ============================================
        /*
        const recipients = getRecipientsFromData();
        
        // First send a text message
        await sendBulkMessages(
            recipients, 
            'Hello! Check out the attachment in the next message.', 
            5
        );
        
        // Then send media
        await sendBulkMediaMessages(
            recipients, 
            'Here is the promised document!', 
            './sample.pdf',
            10
        );
        */

        // ============================================
        // EXAMPLE 7: Progress tracking with custom logic
        // ============================================
        /*
        const recipients = getRecipientsFromData();
        const successList = [];
        const failedList = [];
        
        await sendBulkMessages(recipients, createAdvancedMessage, 10, (progress) => {
            if (progress.status === 'success') {
                successList.push(progress.recipient);
                console.log(`✅ ${progress.current}/${progress.total} - Success: ${progress.recipient}`);
            } else {
                failedList.push({
                    recipient: progress.recipient,
                    error: progress.error
                });
                console.log(`❌ ${progress.current}/${progress.total} - Failed: ${progress.recipient}`);
            }
        });
        
        console.log('\n📊 Final Summary:');
        console.log('Success:', successList);
        console.log('Failed:', failedList);
        */

        console.log('ℹ️  Uncomment an example above to test it!\n');
        console.log('📝 Available examples:');
        console.log('  1. Time-based greetings');
        console.log('  2. Batch processing');
        console.log('  3. Filtered recipients');
        console.log('  4. Scheduled sending');
        console.log('  5. Daily reports');
        console.log('  6. Mixed text and media');
        console.log('  7. Advanced progress tracking\n');

    } catch (error) {
        console.error('❌ Error:', error);
    }
});

// Keep the script running
console.log('⏳ Initializing WhatsApp client...');
console.log('📱 Please scan the QR code when it appears.\n');
