#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');
const os = require('os');
const path = require('path');

let inputFilePath, insertCommandLineNumber, endingAppendString;

// Updated: Function to display usage instructions
function showHelp() {
    console.log('Description:');
    console.log('Splits SQL insert scripts into batches of 999 rows for smooth execution in SSMS');
    console.log('');
    console.log('Usage:');
    console.log('node index.js [options]');
    console.log('');
    console.log('Options:');
    console.log('  -h               Display this help message');
    console.log('  -f <file path>   Specify the input file path (required)');
    console.log('  -s <line number> Specify the starting line number for insert command (optional, default: 1)');
    console.log('  -e <string>      Specify the ending command string (optional, default: "GO")');
    process.exit(0);
}

// Parse command line arguments
for (let i = 2; i < process.argv.length; i++) {
    switch (process.argv[i]) {
        case '-h': // Updated: Handle -h parameter
            showHelp();
            break;
        case '-f': // Input file path
            inputFilePath = process.argv[++i];
            break;
        case '-s': // Starting line number for insert command
            insertCommandLineNumber = parseInt(process.argv[++i]) || 1;
            break;
        case '-e': // Ending command string
            endingAppendString = process.argv[++i];
            break;
    }
}

// Set default values
insertCommandLineNumber = insertCommandLineNumber || 1;
endingAppendString = endingAppendString || 'GO';

if (!inputFilePath) {
    console.log('Please use the -f parameter to specify the file path to process');
    process.exit(1);
}

// Generate output file name
const inputFileName = path.basename(inputFilePath, path.extname(inputFilePath));
const outputFilePath = `${inputFileName}_fix.sql`;

const readStream = fs.createReadStream(inputFilePath, { encoding: 'utf8' });
const writeStream = fs.createWriteStream(outputFilePath);
const rl = readline.createInterface({ input: readStream });

let lineCount = 0;
let insertCommand = '';
let section = '';
let sectionLineCount = 0;

rl.on('line', (line) => {
    lineCount++;
    
    if (lineCount <= insertCommandLineNumber) {
        insertCommand += line + os.EOL;
    } else {
        sectionLineCount++;
        section += line + os.EOL;
        
        if (sectionLineCount === 999) {
            writeSection();
        }
    }
});

rl.on('close', () => {
    if (section) {
        writeSection();
    }
    writeStream.end(() => {
        console.log(`Batch insert SQL statements have been generated: ${outputFilePath}`);
    });
});

function writeSection() {
    if (section.slice(-1) === ',') {
        section = section.slice(0, -1);
    }
    writeStream.write(`${insertCommand}${section}${endingAppendString}${os.EOL}`);
    section = '';
    sectionLineCount = 0;
}