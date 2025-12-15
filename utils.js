/**
 * Utility functions for WhatsApp Bot
 */

/**
 * Save results to a log file
 */
function saveResultsToLog(results, filename = 'message_log.txt') {
    const fs = require('fs');
    const timestamp = new Date().toISOString();

    const logEntry = `
=================================
MESSAGE CAMPAIGN RESULTS
=================================
Timestamp: ${timestamp}
Total Recipients: ${results.total}
Successfully Sent: ${results.sent}
Failed: ${results.failed}
Success Rate: ${((results.sent / results.total) * 100).toFixed(2)}%

${results.errors.length > 0 ? '--- ERRORS ---\n' + results.errors.join('\n') : 'No errors!'}

=================================

`;

    fs.appendFileSync(filename, logEntry);
    console.log(`✅ Results saved to ${filename}`);
}

/**
 * Validate and clean phone number
 */
function cleanPhoneNumber(number) {
    return number.replace(/\D/g, '');
}

/**
 * Calculate estimated time for bulk send
 */
function estimateCompletionTime(recipientCount, delaySeconds) {
    const totalSeconds = (recipientCount - 1) * delaySeconds;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const now = new Date();
    const completionTime = new Date(now.getTime() + totalSeconds * 1000);

    return {
        duration: `${minutes}m ${seconds}s`,
        estimatedCompletion: completionTime.toLocaleString()
    };
}

/**
 * Generate a unique message ID
 */
function generateMessageId() {
    return `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

/**
 * Parse CSV file to recipients array
 */
async function parseCSV(filepath) {
    const fs = require('fs');
    const readline = require('readline');

    const recipients = [];
    const fileStream = fs.createReadStream(filepath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let isFirstLine = true;
    let headers = [];

    for await (const line of rl) {
        if (isFirstLine) {
            headers = line.split(',').map(h => h.trim());
            isFirstLine = false;
            continue;
        }

        const values = line.split(',').map(v => v.trim());
        const recipient = {};

        headers.forEach((header, index) => {
            recipient[header] = values[index];
        });

        recipients.push(recipient);
    }

    return recipients;
}

/**
 * Create a sample CSV file for reference
 */
function createSampleCSV(filename = 'sample_recipients.csv') {
    const fs = require('fs');

    const sampleData = `number,name,company,email
9876543210,Alice Johnson,Tech Corp,alice@example.com
9123456789,Bob Smith,Design Studio,bob@example.com
9555555555,Charlie Brown,Marketing Inc,charlie@example.com`;

    fs.writeFileSync(filename, sampleData);
    console.log(`✅ Sample CSV created: ${filename}`);
}

/**
 * Format number with leading zeros
 */
function padNumber(num, width) {
    return String(num).padStart(width, '0');
}

/**
 * Create a delay/sleep function
 */
function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

/**
 * Retry function with exponential backoff
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;

            const delay = baseDelay * Math.pow(2, i);
            console.log(`⚠️  Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
            await sleep(delay / 1000);
        }
    }
}

/**
 * Validate recipient object
 */
function validateRecipient(recipient) {
    if (typeof recipient === 'string') {
        return recipient.replace(/\D/g, '').length >= 10;
    }

    if (typeof recipient === 'object' && recipient.number) {
        return recipient.number.replace(/\D/g, '').length >= 10;
    }

    return false;
}

/**
 * Get statistics from results
 */
function getStatistics(results) {
    const successRate = ((results.sent / results.total) * 100).toFixed(2);
    const failureRate = ((results.failed / results.total) * 100).toFixed(2);

    return {
        total: results.total,
        sent: results.sent,
        failed: results.failed,
        successRate: `${successRate}%`,
        failureRate: `${failureRate}%`,
        hasErrors: results.errors.length > 0,
        errorCount: results.errors.length
    };
}

/**
 * Create a progress bar
 */
function createProgressBar(current, total, width = 40) {
    const percentage = (current / total);
    const filled = Math.round(width * percentage);
    const empty = width - filled;

    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    const percent = (percentage * 100).toFixed(1);

    return `[${bar}] ${percent}% (${current}/${total})`;
}

/**
 * Display a formatted table
 */
function displayTable(data, columns) {
    console.log('\n' + '='.repeat(80));

    // Header
    const header = columns.map(col => col.padEnd(20)).join(' | ');
    console.log(header);
    console.log('-'.repeat(80));

    // Rows
    data.forEach(row => {
        const rowStr = columns.map(col =>
            String(row[col] || 'N/A').padEnd(20)
        ).join(' | ');
        console.log(rowStr);
    });

    console.log('='.repeat(80) + '\n');
}

module.exports = {
    saveResultsToLog,
    cleanPhoneNumber,
    estimateCompletionTime,
    generateMessageId,
    parseCSV,
    createSampleCSV,
    padNumber,
    sleep,
    retryWithBackoff,
    validateRecipient,
    getStatistics,
    createProgressBar,
    displayTable
};
