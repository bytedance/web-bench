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

# Tasks 
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

# projects files
```html
src/index.html
<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Grid Layout Project</title>
   <link rel="stylesheet" href="styles.css">
</head>
<body>
   <div class="root">
       <div class="header">
           <div class="logo"></div>
           <div class="menu">
               <div class="menu-item">Home</div>
               <div class="menu-item">About</div>
               <div class="menu-item">Contact</div>
           </div>
       </div>
       <div class="leftbar">
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
           <div class="leftbar-item">this is a very long text sample to test word wrap</div>
       </div>
       <div class="content">
           <div class="left-drag"></div>
           <div class="right-drag"></div>
           <div class="card">
               <div class="card-image"></div>
               <div class="card-title">Long Product Title That Goes Here</div>
               <div class="card-price">$99.99</div>
           </div>
           <div class="card">
               <div class="card-image"></div>
               <div class="card-title">Long Product Title That Goes Here</div>
               <div class="card-price">$99.99</div>
           </div>
           <div class="card">
               <div class="card-image"></div>
               <div class="card-title">Long Product Title That Goes Here</div>
               <div class="card-price">$99.99</div>
           </div>
           <div class="card">
               <div class="card-image"></div>
               <div class="card-title">Long Product Title That Goes Here</div>
               <div class="card-price">$99.99</div>
           </div>
           <div class="card">
               <div class="card-image"></div>
               <div class="card-title">Long Product Title That Goes Here</div>
               <div class="card-price">$99.99</div>
           </div>
           <div class="card">
               <div class="card-image"></div>
               <div class="card-title">Long Product Title That Goes Here</div>
               <div class="card-price">$99.99</div>
           </div>
           <div class="card">
               <div class="card-image"></div>
               <div class="card-title">Long Product Title That Goes Here</div>
               <div class="card-price">$99.99</div>
           </div>
           <div class="card">
               <div class="card-image"></div>
               <div class="card-title">Long Product Title That Goes Here</div>
               <div class="card-price">$99.99</div>
           </div>
           <div class="card">
               <div class="card-image"></div>
               <div class="card-title">Long Product Title That Goes Here</div>
               <div class="card-price">$99.99</div>
           </div>
           <div class="card">
               <div class="card-image"></div>
               <div class="card-title">Long Product Title That Goes Here</div>
               <div class="card-price">$99.99</div>
           </div>
           <div class="card" style="order: 12;">
               <div class="card-image"></div>
               <div class="card-title">Long Product Title That Goes Here</div>
               <div class="card-price">$99.99</div>
           </div>
           <div class="card" style="order: 11;">
               <div class="card-image"></div>
               <div class="card-title">Long Product Title That Goes Here</div>
               <div class="card-price">$99.99</div>
           </div>
       </div>
       <div class="rightbar">
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
           <div class="rightbar-item">this-is-a-very-long-text-sample-to-test-overflow</div>
       </div>
       <div class="footer">
           <div class="footer-logo">Logo</div>
           <div class="footer-info">Company Information and Copyright Details That Should Show Ellipsis When Space Is Insufficient</div>
       </div>
   </div>
   <script src="script.js"></script>
</body>
</html>
```

```css
src/styles.css
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body, html {
    height: 100%;
    font-family: Arial, sans-serif;
}

.root {
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-areas: 
        "header header header"
        "leftbar content rightbar"
        "footer footer footer";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: min(200px, 20vw) 1fr max(200px, 20vw);
}

.header {
    grid-area: header;
    background-color: #f0f0f0;
    padding: 10px;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
}

.footer {
    grid-area: footer;
    background-color: #f0f0f0;
    padding: 10px;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 10px;
}

.content {
    grid-area: content;
    background-color: #ffffff;
    padding: 20px;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    position: relative;
}

.leftbar {
    grid-area: leftbar;
    background-color: #e0e0e0;
    padding: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(20, 1fr);
    gap: 5px;
    overflow: auto;
}

.rightbar {
    grid-area: rightbar;
    background-color: #d0d0d0;
    padding: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(10, 1fr);
    gap: 5px;
    overflow: auto;
}

.logo {
    background-color: #4CAF50;
    width: 60px;
    height: 40px;
    border-radius: 4px;
}

.menu {
    display: grid;
    grid-template-columns: repeat(3, auto);
    gap: 20px;
    justify-content: end;
}

.menu-item {
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
}

.leftbar-item, .rightbar-item {
    background-color: #f9f9f9;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 12px;
}

.leftbar-item {
    word-wrap: break-word;
}

.rightbar-item {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.card {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    min-height: 100px;
    display: grid;
    grid-template-rows: 1fr auto auto;
    gap: 10px;
}

.card-image {
    background-color: #ccc;
    border-radius: 4px;
    min-height: 60px;
}

.card-title {
    font-weight: bold;
    min-height: 1.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-price {
    color: #007bff;
    font-weight: bold;
    min-height: 1rem;
}

.footer-logo {
    background-color: #4CAF50;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
}

.footer-info {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.left-drag, .right-drag {
    position: absolute;
    width: 10px;
    height: 100%;
    background-color: #007bff;
    opacity: 0;
    cursor: ew-resize;
    z-index: 10;
}

.left-drag {
    left: 0;
    top: 0;
}

.right-drag {
    right: 0;
    top: 0;
}

.content:hover .left-drag,
.content:hover .right-drag {
    opacity: 0.7;
}

@media (max-width: 799px) {
    .root {
        grid-template-areas: 
            "header header"
            "content rightbar"
            "footer footer";
        grid-template-columns: 1fr max(200px, 20vw);
    }
    
    .leftbar {
        display: none;
    }
}

@media (max-width: 999px) {
    .content {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 599px) {
    .content {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 399px) {
    .root {
        grid-template-areas: 
            "header"
            "content"
            "rightbar"
            "footer";
        grid-template-columns: 1fr;
    }
    
    .header {
        grid-template-columns: 1fr;
    }
    
    .logo {
        display: none;
    }
    
    .menu {
        grid-template-columns: 1fr;
        justify-content: stretch;
        gap: 0;
    }
    
    .menu-item {
        text-align: center;
        border-radius: 0;
    }
    
    .rightbar {
        grid-template-rows: repeat(3, 1fr);
    }
    
    .rightbar-item:nth-child(n+7) {
        display: none;
    }
    
    .right-drag {
        bottom: 0;
        top: auto;
        width: 100%;
        height: 10px;
        cursor: ns-resize;
    }
}
```

```javascript
src/script.js
document.addEventListener('DOMContentLoaded', function() {
    const leftDrag = document.querySelector('.left-drag');
    const rightDrag = document.querySelector('.right-drag');
    const content = document.querySelector('.content');
    const root = document.querySelector('.root');
    
    let isDragging = false;
    let dragType = '';
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    
    function initDrag(e, type) {
        isDragging = true;
        dragType = type;
        
        if (window.innerWidth < 400 && type === 'right') {
            startY = e.clientY;
            startHeight = content.offsetHeight;
        } else {
            startX = e.clientX;
            startWidth = content.offsetWidth;
        }
        
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', stopDrag);
        e.preventDefault();
    }
    
    function handleDrag(e) {
        if (!isDragging) return;
        
        if (window.innerWidth < 400 && dragType === 'right') {
            const deltaY = e.clientY - startY;
            const newHeight = Math.max(100, startHeight + deltaY);
            content.style.height = newHeight + 'px';
        } else {
            const deltaX = e.clientX - startX;
            let newWidth;
            
            if (dragType === 'left') {
                newWidth = Math.max(100, startWidth - deltaX);
            } else {
                newWidth = Math.max(100, startWidth + deltaX);
            }
            
            content.style.width = newWidth + 'px';
        }
    }
    
    function stopDrag() {
        isDragging = false;
        dragType = '';
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', stopDrag);
    }
    
    leftDrag.addEventListener('mousedown', (e) => initDrag(e, 'left'));
    rightDrag.addEventListener('mousedown', (e) => initDrag(e, 'right'));
});
```

# Generate Test codes from Tasks 
1. Generate Playwright test code in `test/task-n.spec.js` from task-15 to task-20.
2. Provide 3–5 test cases for each task.
3. Avoid overly strict test cases. Minimize direct assertions on CSS or HTML attributes. Instead, focus on validating the behavior of page elements—such as their size (e.g., width/height) and interactions (e.g., click, drag and drop).