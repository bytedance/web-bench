# [System Prompt](./system.md)

# Generate Project codes from Tasks 
Generate the project source code (javascript, css and html) files in `src/` directory. The Project described by the following tasks:

1. Add toolkit container (class 'toolkit') and svg element (class 'canvas')  in '.root'. toolkit and canvas together fill the whole space of the browser element. Add shape container (class 'shape'), prop container (class 'prop') and operation container (class 'operation') horizontally in the toolkit. shape container (3 labels width) is at the toolkit's left side. operation container (6 labels width) is at the toolkit's right side. prop container occupies the toolkit's remaining space. Add a line width input (class 'line-width', value from 1 to 21, default is 9) in the prop container. Add a color selector input (class 'color', default is #000000) in the prop container.
2. Add radios wrapped by label in shape container with values: line, rect, ellipse. Add radios wrapped by label in operation container with values: move, rotate, zoom, copy, delete, fill. Each radio in both shape and operation container has the same name 'operation'. Each label's class is the the value of its inner radio. Generate an SVG image using the label's class and use it as the label's background image. Set each radio width/height to 0 but not hide them.
3. When click label line, use mouse in canvas to draw a svg line (line width is '.line-width' value, line color is '.color' value). The line's start point is the point when mouse pressing down and end point is the point when mouse pressing up.
4. When click label rect, use mouse in canvas to draw a svg rect (fill color is white, line width is '.line-width' value, line color is '.color' value). The rect's left-top is the point when mouse pressing down and right-bottom is the point when mouse pressing up.
5. When click label ellipse, use mouse in canvas to draw a svg ellipse (fill color is white, line width is '.line-width' value, line color is '.color' value). There is a rect whose left-top is the point when mouse pressing down and right-bottom is the point when mouse pressing up. The ellipse's center is the rect center, x radius is the half rect width, y radius is the half rect height.
6. After label delete clicked, click any shape (line/rect/ellipse/...) in the canvas to delete it.
7. After label fill clicked, click any shape (line/rect/ellipse/...) in the canvas to set its fill color to '.color' value.
8. After label copy clicked, click any shape (line/rect/ellipse/...) in the canvas to copy itself. The copied shape is placed 20 to the right and 20 below the original shape.
9. When the length of the line is less than line width, keep it to be the line width.
10. When the width or height of the rect is less than line width, keep it to be line width.
11. When the x or y radius of the ellipse is less than half line width, keep it to be half line width.
12. After label move clicked, drag and move any shape in the canvas.
13. After label rotate clicked, drag and rotate any shape in the canvas around its center.
14. Perform move and rotate operations on a shape in any sequence, ensuring that each operation builds on the previous one.
15. After label zoom clicked, drag and zoom any shape in the canvas according the distance between mouse position and its center. Zoom the shape around its center.
16. Perform move, rotate, and zoom operations on a shape in any sequence, ensuring that each operation builds on the previous one.
17. Set label move clicked after creating or copying a shape.
18. Press and hold the blankspace to enable moving the shape. Release it to restore the selected label if needed.
19. Support touch events for operations: create, copy, delete, fill.
20. Support touch events for operations: move, rotate, zoom.
