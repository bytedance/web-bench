const fs = require('node:fs')
const path = require('node:path')

function translate(inputFile) {
  const tasks = fs
    .readFileSync(inputFile)
    .toString()
    .split('\n')
    .map((o) => JSON.parse(o))

  return tasks.map((task, i) => `${i + 1}. ${task.description}`).join('\n')
}

const md = translate(path.resolve(__dirname, 'tasks.jsonl'))
console.log(md)
