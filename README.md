# SQL Insert Batch Splitter

[![NPM Version](https://img.shields.io/npm/v/%40eeyellow%2Fsplitsql)](https://www.npmjs.com/package/%40eeyellow%2Fsplitsql) ![NPM License](https://img.shields.io/npm/l/%40eeyellow%2Fsplitsql)


A Node.js utility to split large SQL insert scripts into batches of 999 rows for smooth execution in SQL Server Management Studio (SSMS).

## Description

This tool processes SQL insert scripts and splits them into smaller batches, each containing up to 999 rows. This is particularly useful when dealing with large datasets that need to be inserted into SQL Server, as it helps avoid potential issues with query size limits in SSMS.

## Installation

```bash
npm install -g @eeyellow/splitsql
```

## Usage

```bash
splitsql [options]
```

### Options

- `-h`: Display help message
- `-f <file path>`: Specify the input file path (required)
- `-s <line number>`: Specify the starting line number for insert command (optional, default: 1)
- `-e <string>`: Specify the ending command string (optional, default: "GO")

### Example

```bash
splitsql -f large_insert_script.sql -s 1 -e "GO"
```