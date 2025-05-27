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

# Generate Project codes from Tasks 
Generate the project source code (javascript, css and html) files in `src/` directory. The Project described by the following tasks:

1. add divs(class 'header', 'footer', 'content') with arbitrary text in '.root' element. '.root' occupies total viewport and children elements together occupy total '.root' space. header (border-box) is always fixed at the top of '.root'; footer (border-box) is always fixed at the bottom of '.root'; content (border-box) occupies the remaining '.root' space. USE css grid only, NO css flex, float and position, NO js.
2. add divs(class 'leftbar', 'rightbar') with arbitrary text in '.root' element. leftbar (border-box) is fixed at the left of '.root'; rightbar (border-box) is fixed at the right of '.root'; content occupies the remaining '.root' space. Use grid only.
3. clear header content. add menu(class 'menu') with 3 items(arbitrary text) at the right side of header. Use grid only too.
4. add logo(class 'logo') with arbitrary background color at the left side of header. Use grid only.
5. leftbar width is the smaller of 200px and 20vw. rightbar width is the bigger of 200px and 20vw. leftbar should disappear when page width is equal to or less than 799px.
6. when page width is equal to or less than 399px, menu items should have evenly spaced distribution in the whole header space and logo should disappear.
7. when page width is less than 400px, content and rightbar should occupy full page width and rightbar should be at the bottom of content.
8. when page width is less than 400px, each menu item should occupy full page width.
9. separate leftbar whole space into 20 rows and 2 columns. fill each cell with text 'this is a very long text sample to test word wrap'. USE grid only.
10. separate rightbar whole space into 10 rows and 2 columns; fill 40 items in the rightbar whole space. fill each item with text 'this-is-a-very-long-text-sample-to-test-overflow'. USE grid only.
11. when page width is less than 400px, display the first 3 rows in rightbar.
12. show 12 cards (class 'card') in content with 3 per row, 100px minimum height each and vertical scrolling enabled.
13. when page width is less than 1000px, display 2 cards per row in content.
14. when page width is less than 600px, display 1 card per row in content.
15. each card has a image(class 'card-image'), title and price; title's minimum height is 1.5rem and no wrap, text is 'Long Product Title That Goes Here'; price's minimum height is 1rem; image uses the remaining space. USE grid only.
16. only change card css property to reverse the order of the last 2 cards.
17. add a logo(class 'footer-logo') and info (class 'footer-info') in the footer. footer-info should never wrap and should show ellipsis when space is insufficient.
18. add left-drag and right-drag with absolute positions at the left and right sides of the content; left-drag and right-drag are not visible by default and become visible when mouse hovers over content.
19. gen js, drag right-drag and left-drag to adjust content width.
20. when page width is less than 400px, move right-drag to the bottom of content and drag right-drag to adjust content height.

# Generate Test codes from Tasks 

Generate playwright test code in `test/task-n.spec.js` for each task.