// Simple example script for sending bulk messages
// This file demonstrates how to use the bulk sender

const { sendBulkMessages } = require('./bulkSender');

// Wait for client to be ready
setTimeout(async () => {
    console.log('Starting example bulk message campaign...\n');

    // Define your recipients
    // Option 1: Just phone numbers (add country code or configure in bulkSender.js)
    const recipients = [
        '9876543210',  // Example Indian number
        '9123456789',
        // Add more numbers here
    ];

    // Option 2: Recipients with names for personalization
    const recipientsWithDetails = [
        { number: '9876543210', name: 'Alice', company: 'ABC Corp' },
        { number: '9123456789', name: 'Bob', company: 'XYZ Ltd' },
        // Add more recipients here
    ];

    // Simple message
    const simpleMessage = `Hello! 👋

This is a test message from WhatsApp Bulk Sender Bot.

Thank you!`;

    // Personalized message using template function
    const personalizedMessage = (recipient, messageNumber) => {
        return `Hi ${recipient.name}! 👋

This is a personalized message for you from ${recipient.company}.
This is message #${messageNumber} in our campaign.

Best regards,
Your Team`;
    };

    try {
        // Example 1: Send simple message to all recipients
        console.log('Example 1: Sending simple messages...\n');
        // await sendBulkMessages(recipients, simpleMessage, 10); // 10 seconds delay

        // Example 2: Send personalized messages
        console.log('Example 2: Sending personalized messages...\n');
        // await sendBulkMessages(recipientsWithDetails, personalizedMessage, 15); // 15 seconds delay

        // Example 3: With progress callback
        console.log('Example 3: Sending with progress tracking...\n');
        /*
        await sendBulkMessages(recipientsWithDetails, personalizedMessage, 10, (progress) => {
            if (progress.status === 'success') {
                console.log(`✓ Sent ${progress.current}/${progress.total} to ${progress.recipient}`);
            } else {
                console.log(`✗ Failed ${progress.current}/${progress.total}: ${progress.error}`);
            }
        });
        */

        console.log('\n⚠️  Uncomment the example you want to run in example.js\n');

    } catch (error) {
        console.error('Error in bulk messaging:', error);
    }

    // Note: The script will keep running to maintain the WhatsApp connection
    // Press Ctrl+C to exit

}, 5000); // Wait 5 seconds after script starts
