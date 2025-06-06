# Context
* read file content from 'draw3/tasks.jsonl'
* read files content from 'draw3/src/*'
* read files content from 'draw3/test/*.spec.js'

# Task: Analyze tasks.jsonl for Format Errors and Consistency Issues
Please perform the following analysis:

Identify format errors in tasks.jsonl, including:

* Incorrect level values (valid values are: easy, medium, challenging)
* English grammar issues
* Inaccurate English expressions
* Punctuation problems
* Other format errors


Check consistency across task files: For each task in tasks.jsonl, examine the following files for contradictions:

* task-n (task description)
* task-n.spec.js (test specification)
* src/* (source code)

Identify any inconsistencies between these files and provide specific modification suggestions to resolve the contradictions.

Expected Output:

* List of format errors found in tasks.jsonl with specific line numbers and corrections
* For each task, document any contradictions between the three file types and recommend fixes to ensure alignment
* write files content to the respective files in 'draw3/*' directly