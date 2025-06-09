# Context
Read and analyze all files from the 'draw3/' directory:
- tasks.jsonl
- All files in src/ and subdirectories (src/**/*) 
- All test specification files, from 'task-1.spec.js' to 'task-20.spec.js'
- NO any other files

# Task 1: Analyze tasks.jsonl for Format Errors
Please identify format errors in tasks.jsonl, including:
* Incorrect level values (valid values are: easy, moderate, challenging)
* English grammar issues
* Inaccurate English expressions
* Punctuation problems
* Other format errors

Expected Output:
* Table of format errors found in tasks.jsonl with specific line numbers and corrections
* write files content to the respective files directly

# Task 2: Analyze tasks.jsonl for Format Errors and Consistency Issues
Check consistency across task files: For each task in tasks.jsonl, examine the following files for contradictions:
* task-n (task description)
* task-n.spec.js (test specification)
* src/* (source code)

Identify any inconsistencies between these files and provide specific modification suggestions to resolve the contradictions.

Expected Output:
* Table of consistency checking file names in each task, highlight any contradictions between the three file types and recommend fixes to ensure alignment
* write files content to the respective files directly