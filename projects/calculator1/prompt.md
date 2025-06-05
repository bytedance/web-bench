# src/ to tasks.yml

You are an AI assistant tasked with generating implementation tasks for a calculator project. Your goal is to analyze two versions of the source code and create a list of tasks that describe how to implement the features in the final version.

First, I will provide you with two HTML files:

1. The initial version of the calculator: 
<src_init_code>
read file content from 'calculator1/src-init/index.html'
</src_init_code>

2. The final version of the calculator: 
<src_code>
read file content from 'calculator1/src/index.html'
</src_code>

Please analyze these two files carefully, paying attention to the differences between them. Focus on the features and functionality that have been added or modified in the final version.

Based on your analysis, generate 20 implementation tasks that describe how to implement the features in the final version, starting from the initial version. Follow these guidelines:

1. Ensure no features are omitted.
2. Focus on feature-level requirements, reducing styling-related tasks unless they are essential (e.g., dark mode).
3. Generate tasks from level easy to level challenging.
4. Prioritize clear, descriptive explanations of each UI feature.
5. Minimize discussion of JavaScript, CSS, or HTML implementation details.
6. Only include the shortest possible CSS selectors necessary to identify relevant elements.

Format each task as follows:

```yaml
- id: task-[number]
  date: [YYYY-MM-DD]
  level: [easy/medium/challenging]
  description: |
    [Task description]
```

Use the following date format: YYYY-MM-DD, starting from 2025-05-01 and incrementing by one day for each task.

Here's an example of how a task should be formatted:

```yaml
- id: task-1
  date: 2025-05-01
  level: easy
  description: |
    1. Add a display element with the class "calculator__display" to show the current calculation and result.
    2. Ensure the display is read-only and can show multiple lines of text.
```

Now, please generate 20 implementation tasks based on the differences between the initial and final versions of the calculator. Save the output as a file at 'calculator1/tasks.yml'.


# src/ & tasks.yml to test/

You are tasked with generating Playwright test codes based on the provided tasks.yml file and index.html file. Here's the content of these files:

<tasks_yml>
read file content from 'calculator1/tasks.yml'
</tasks_yml>

<index_html>
read file content from 'calculator1/src/index.html'
</index_html>

Your task is to generate Playwright test codes for each task defined in the tasks.yml file. Follow these instructions carefully:

1. Read and analyze the content of tasks.yml and index.html files.
2. For each task in tasks.yml, generate a separate Playwright test file.
3. Name and save each test file as 'calculator1/test/task-n.spec.js', where 'n' is the task number.
4. For each task, create 3 test cases that validate the functionality described in the task.
5. Start each test case with `page.goto('/index.html')` to open the test page.
6. Ensure that the CSS selectors used in your test code match those referenced in tasks.yml.
7. Focus on testing the behavior and functionality of page elements rather than specific CSS or HTML attributes. For example, test element sizes (width/height) or interactions (click, drag and drop) instead of exact CSS values.
8. Avoid overly strict test cases. Allow for some flexibility in your assertions where appropriate.
9. Use Playwright's built-in assertions and methods for interacting with page elements.
10. Include comments in your test code to explain the purpose of each test case.
11. Structure your test file using describe() for the task and it() for each test case.

Here's an example of how your test file structure should look:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Task n: [Task Description]', () => {
  test('Test case 1: [Description]', async ({ page }) => {
    await page.goto('/index.html');
    // Test implementation
  });

  test('Test case 2: [Description]', async ({ page }) => {
    await page.goto('/index.html');
    // Test implementation
  });

  test('Test case 3: [Description]', async ({ page }) => {
    await page.goto('/index.html');
    // Test implementation
  });
});
```

Remember to replace [Task Description] and [Description] with appropriate descriptions for each task and test case.

When you're done, provide the generated test code for each task in separate code blocks, clearly labeled with the task number and file name.

Begin generating the test codes now. If you need any clarification or have any questions about the tasks or requirements, please ask before proceeding.