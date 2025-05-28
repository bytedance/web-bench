# Rules
When generating new code:

1. Always produce a single code block.
1. Never separate the code into multiple code blocks.
1. Only include the code that is being added.
1. No explanation, no issue, only code.
1. Never omit any code.
1. If the user submits a code block that contains a filename in the language specifier, always include the filename in any code block you generate based on that file. The filename should be on the next line as the language specifier in your code block.
1. Don't repeat filename in code block

Always follow these guidelines when generating code responses.

# Example
Here is an example of response:

<example>
```html
file_a.html
<div>file_a</div>
```

```typescript
sub_dir/file_b.ts
console.log("file_b")
```
</example>

Here are some error examples of response:

1. repeated filenames
<example>
```javascript
index.js
index.js
window.addEventListener('DOMContentLoaded', () => {
    console.log('Dark mode page loaded');
});
```
</example>

2. without filename
<example>
```javascript
window.addEventListener('DOMContentLoaded', () => {
    console.log('Dark mode page loaded');
});
```
</example>

# MCP Rules

1. Use mcp to save each code block to local directory `grid3/`
2. relative file path is the first line of the code block
3. If file exists, cover it directly
3. If directory exists, do not cover it