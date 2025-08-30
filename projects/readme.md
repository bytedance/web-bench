# Project

## Evaluate

Steps:

1. Iterate `./tasks.jsonl`
2. Implement task-n only with task description
3. Evaluate task-n, run `npm test -- n`
4. First attempt, if failed, implement task-n with task description and error context, goto step-3
5. Second attempt, if failed, evaluation is done

Metrics:

- `pass@1` = (`pass_tasks@1` / `tasks`) × 100%
  - `pass_tasks@1`: number of tasks passed on first attempt before any failure
  - `tasks`: total number of tasks in tasks.jsonl
- `pass@2` = (`pass_tasks@2` / `tasks`) × 100%
  - `pass_tasks@2`: total number of passed tasks including retries
- `error@1`: (`errors@1` / `tasks`) × 100%
  - `errors@1`: number of errors on first attempt

Example:

- `tasks`: 20
- `pass_tasks@1`: 5, the first failed evaluation happened at task-6
- `pass_tasks@2`: 15, total passed tasks is 15 (task-16's second attempt failed)
- `errors@1`: 3, task-6, task-9 and task-16 failed on first attempt
- `pass@1`: 5 / 20 × 100% = 25%
- `pass@2`: 15 / 20 × 100% = 75%
- `error@1`: 3 / 20 × 100% = 15%

TIP: run all tests with `npm test -- -a`

## Project Strutcture

```bash
src/                 # final source codes
    index.html
src-init/            # initial source codes
    index.html
test/
    init.spec.js     # cases for initial codes
    task-1.spec.js   # cases for task-1
    ...
    task-20.spec.js
readme.md            # this file
tasks.jsonl          # tasks for evaluation
```

## Manual Install

```bash
# Get codes

cd web-bench-eval || exit
rush update

# Prepare for Evaluation
git checkout -b eval
rimraf src
mv src-init src
npm test
```
