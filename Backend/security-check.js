#!/usr/bin/env node
// Security check script for the Playmate backend
const fs = require('fs');
const path = require('path');

console.log('🔍 Security Check - Scanning for Malicious Code');
console.log('================================================\n');

// Patterns that indicate potentially malicious code
const maliciousPatterns = [
    /require\(['"]request['"]\)/,
    /Buffer\[.*\].*fromChar/,
    /String\[.*\].*de/,
    /0x[0-9a-f]+/g,
    /eval\(/,
    /Function\(/,
    /child_process/,
    /exec\(/,
    /spawn\(/,
    /rq\s*=\s*require/,
    /const\s+[a-zA-Z]\s*=\s*[a-zA-Z]\(/,
    /obfuscated|malware|trojan/i
];

// Files to check
const filesToCheck = [
    'app.js',
    'userDetails.js',
    'teamDetails.js',
    'teamMembers.js',
    'sportsDetails.js',
    'imageDetails.js',
    'userFriends.js',
    'eventDetails.js',
    'userEvents.js',
    'migrate.js',
    'test-migration.js'
];

let issuesFound = 0;

function checkFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        let fileIssues = 0;
        
        lines.forEach((line, index) => {
            maliciousPatterns.forEach(pattern => {
                if (pattern.test(line)) {
                    if (fileIssues === 0) {
                        console.log(`⚠️  ${filePath}:`);
                    }
                    console.log(`   Line ${index + 1}: ${line.trim()}`);
                    fileIssues++;
                    issuesFound++;
                }
            });
        });
        
        if (fileIssues === 0) {
            console.log(`✅ ${filePath} - Clean`);
        } else {
            console.log(`❌ ${filePath} - ${fileIssues} potential issues found\n`);
        }
        
    } catch (error) {
        console.log(`❓ ${filePath} - Could not read file: ${error.message}`);
    }
}

// Check each file
filesToCheck.forEach(file => {
    const filePath = path.join(__dirname, file);
    checkFile(filePath);
});

console.log('\n' + '='.repeat(50));
if (issuesFound === 0) {
    console.log('🎉 No suspicious code patterns found!');
} else {
    console.log(`⚠️  Found ${issuesFound} potential security issues.`);
    console.log('   Please review the flagged code manually.');
}
console.log('='.repeat(50));
