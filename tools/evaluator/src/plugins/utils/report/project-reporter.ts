// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { TaskResultSnippet, TaskSnippet } from '@web-bench/evaluator-types'
import dayjs from 'dayjs'
import {
  getErrorRate,
  getOrdinalNumberAbbreviation,
  getPassRate,
  getTotalInputToken,
  getTotalOutputToken,
} from '../../../utils/report'
import path from 'path'
import fs from 'fs/promises'

export class ProjectReporter {
  /**
   * Detailed record of a single task execution
   */
  public getReportResultSnippet(
    id: string,
    description: string,
    result: TaskResultSnippet,
    index: number
  ) {
    return `
#### ${getOrdinalNumberAbbreviation(index + 1)} Attempt ${result.success ? '✅' : '❌'}
        
*Description:*
${description}
        
${
  result.screenshot
    ? `
*Screenshot:*
![screenshot-${id}-${index}](./${result.screenshot})
`
    : ''
}
        
    
*Request${result.inputTokens ? ` (${result.inputTokens} inputTokens)` : ''}:*
        
\`\`\`json
${JSON.stringify(JSON.parse(result.request || '{}'), null, 2)}
\`\`\`
        
        
*Response${result.outputTokens ? ` (${result.outputTokens} outputTokens)` : ''}:*

${Object.keys(result.response || {})
  .map((path) => {
    return `
\`\`\`${path.split('.').pop()}
${path}
${(result.response || {})[path]}
\`\`\`
  
  `
  })
  .join('\n')}

${result.trajectory ? `*Trajectory:*\n\`\`\`\n${result.trajectory}\n\`\`\`` : ''}

${
  result.errorMessage
    ? `
*ErrorMessage:*     
${result.errorMessage}
`
    : ''
}
`
  }

  /**
   * Each task execution includes multiple records
   */
  public getReportSnippet(task: TaskSnippet) {
    return `
### ${task.id}
				${task.result
          .map((result, index) =>
            this.getReportResultSnippet(task.id, task.description, result, index)
          )
          .join('\n')}
			  
			  `
  }

  /**
   * Generate metrics table based on taskSnippets
   */
  public getMetricsTable({
    allTaskCount,
    times,
    taskSnippets,
  }: {
    taskSnippets: TaskSnippet[]
    allTaskCount: number
    times: number
  }): string {
    const passRate = getPassRate(taskSnippets, allTaskCount, times)

    const errorRate: number[] = getErrorRate(taskSnippets, allTaskCount, times)

    const totalInputToken = getTotalInputToken(taskSnippets)
    const totalOutputToken = getTotalOutputToken(taskSnippets)


    return `	  
| Metric | Result |
| ------ | ------ |
${passRate.map((v, i) => `|pass@${i + 1} | ${v}% |`).join('\n')}
${errorRate.map((v, i) => `|error@${i + 1} | ${v}% |`).join('\n')}
|inputTokens|${totalInputToken}|
|outputTokens|${totalOutputToken}|
`
  }

  public getResultsTable({ taskSnippets, times }: { taskSnippets: TaskSnippet[]; times: number }) {
    const timeArr = new Array(times).fill(0)

    return `
| Task             | ${timeArr.map((v, i) => `${getOrdinalNumberAbbreviation(i + 1)} Result |`).join('')} inputTokens | outputTokens |
| ---------------- | ${timeArr.map((v, i) => `----------- | `).join('')} ----------- | ----------- |
${taskSnippets
  .map(
    (task) =>
      `|${task.id}|${timeArr.map((v, i) => (task.result[i] ? (task.result[i].success ? '✅ |' : '❌ |') : '- |')).join('')} ${task.inputTokens} | ${task.outputTokens} |`
  )
  .join('\n')}
`
  }

  /**
   * Temporary report initialization content
   */
  public getTempleReportInitContent({
    model,
    allTaskCount,
    endpoint,
    projectName,
  }: {
    model?: string
    allTaskCount: number
    endpoint?: string
    projectName: string
  }) {
    return `
# Evaluation Report for ${projectName}
  
${model ? `* Model: ${model}` : ''}
${endpoint ? `* EndPoint: ${endpoint}` : ''}

* Tasks: ${allTaskCount}

## Evaluation Details
    `
  }

  /**
   * Complete report content
   */
  public getModelReportContent = ({
    taskSnippets,
    allTaskCount,
    model,
    taskSnippetsWithoutInit,
    endpoint,
    projectName,
    retry,
  }: {
    taskSnippets: TaskSnippet[]
    taskSnippetsWithoutInit: TaskSnippet[]
    retry: number
    endpoint?: string
    allTaskCount: number
    model?: string
    projectName: string
  }) => {
    const times = retry

    const TEMPLE = `
	  
# Evaluation Report for ${projectName}
  
${model ? `* Model: ${model}` : ''}
${endpoint ? `* EndPoint: ${endpoint}` : ''}

* Tasks: ${allTaskCount}
  
* Exported: ${dayjs().format('YYYY/MM/DD HH:mm:ss')}
	  
## Metrics
${this.getMetricsTable({ allTaskCount, taskSnippets: taskSnippetsWithoutInit, times })}

## Evaluation Results
✅ pass ❌ error
${this.getResultsTable({ taskSnippets, times })}
  
## Evaluation Details
${taskSnippets.map((task) => this.getReportSnippet(task)).join('\n')}
`

    return TEMPLE
  }

  /**
   * report temporary log
   */

  public async reportTaskSnippet(ctx: {
    id: string
    description: string
    result: TaskResultSnippet
    index: number
    reportDir: string
    reportName: string
  }) {
    const { id, description, reportDir, reportName, result, index } = ctx
    let content = this.getReportResultSnippet(id, description, result, index)

    const reportPath = path.join(reportDir, reportName + '.report.md')

    // content
    if (!index) {
      content = '\n### ' + id + '\n' + content
    }

    await fs.appendFile(reportPath, content + '\n', {
      encoding: 'utf-8',
    })
  }
}
