document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  const canvas = document.querySelector('.canvas');
  const lineWidthInput = document.querySelector('.line-width');
  const colorInput = document.querySelector('.color');
  const operationRadios = document.querySelectorAll('input[name="operation"]');
  
  // Set SVG namespace
  const svgNS = 'http://www.w3.org/2000/svg';
  
  // Initialize variables
  let currentOperation = null;
  let isDrawing = false;
  let startX, startY;
  let currentShape = null;
  let selectedShape = null;
  let originalTransform = null;
  let centerX, centerY;
  let startAngle, currentAngle;
  let startDistance, originalScale;
  
  // Set canvas size
  function updateCanvasSize() {
    canvas.setAttribute('width', canvas.clientWidth);
    canvas.setAttribute('height', canvas.clientHeight);
  }
  
  // Initialize canvas size
  updateCanvasSize();
  window.addEventListener('resize', updateCanvasSize);
  
  // Set up event listeners for operation radios
  operationRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentOperation = e.target.value;
      if (selectedShape) {
        selectedShape.classList.remove('selected');
        selectedShape = null;
      }
    });
  });
  
  // Set default operation to 'line'
  document.querySelector('input[value="line"]').checked = true;
  currentOperation = 'line';
  
  // Mouse event handlers
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);
  
  // Touch event handlers
  canvas.addEventListener('touchstart', handleTouchStart);
  canvas.addEventListener('touchmove', handleTouchMove);
  canvas.addEventListener('touchend', handleTouchEnd);
  
  // Keyboard event handlers for spacebar
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  
  let previousOperation = null;
  
  function handleKeyDown(e) {
    if (e.code === 'Space' && !e.repeat) {
      previousOperation = currentOperation;
      currentOperation = 'move';
      document.querySelector('input[value="move"]').checked = true;
    }
  }
  
  function handleKeyUp(e) {
    if (e.code === 'Space' && previousOperation) {
      currentOperation = previousOperation;
      document.querySelector(`input[value="${previousOperation}"]`).checked = true;
      previousOperation = null;
    }
  }
  
  // Convert touch event to mouse position
  function getTouchPosition(touch) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }
  
  function handleTouchStart(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const pos = getTouchPosition(touch);
      handleStart(pos.x, pos.y);
    }
  }
  
  function handleTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 1 && isDrawing) {
      const touch = e.touches[0];
      const pos = getTouchPosition(touch);
      handleMove(pos.x, pos.y);
    }
  }
  
  function handleTouchEnd(e) {
    e.preventDefault();
    handleEnd();
  }
  
  function handleMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    handleStart(x, y);
  }
  
  function handleMouseMove(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    handleMove(x, y);
  }
  
  function handleMouseUp() {
    handleEnd();
  }
  
  function handleStart(x, y) {
    startX = x;
    startY = y;
    
    switch (currentOperation) {
      case 'line':
      case 'rect':
      case 'ellipse':
        isDrawing = true;
        createShape(x, y);
        break;
      case 'move':
      case 'rotate':
      case 'zoom':
        const clickedShape = findShapeAtPosition(x, y);
        if (clickedShape) {
          isDrawing = true;
          selectedShape = clickedShape;
          
          // Store original transform for operations
          originalTransform = selectedShape.getAttribute('transform') || '';
          
          // Calculate center of the shape for rotate and zoom
          const bbox = selectedShape.getBBox();
          centerX = bbox.x + bbox.width / 2;
          centerY = bbox.y + bbox.height / 2;
          
          if (currentOperation === 'rotate') {
            startAngle = Math.atan2(y - centerY, x - centerX);
          } else if (currentOperation === 'zoom') {
            startDistance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            originalScale = getScaleFromTransform(originalTransform) || 1;
          }
        }
        break;
      case 'copy':
      case 'delete':
      case 'fill':
        const targetShape = findShapeAtPosition(x, y);
        if (targetShape) {
          if (currentOperation === 'copy') {
            copyShape(targetShape);
          } else if (currentOperation === 'delete') {
            deleteShape(targetShape);
          } else if (currentOperation === 'fill') {
            fillShape(targetShape);
          }
        }
        break;
    }
  }
  
  function handleMove(x, y) {
    if (!isDrawing) return;
    
    switch (currentOperation) {
      case 'line':
        updateLine(x, y);
        break;
      case 'rect':
        updateRect(x, y);
        break;
      case 'ellipse':
        updateEllipse(x, y);
        break;
      case 'move':
        if (selectedShape) {
          moveShape(selectedShape, x - startX, y - startY);
          startX = x;
          startY = y;
        }
        break;
      case 'rotate':
        if (selectedShape) {
          currentAngle = Math.atan2(y - centerY, x - centerX);
          const angleDiff = currentAngle - startAngle;
          rotateShape(selectedShape, angleDiff * (180 / Math.PI));
          startAngle = currentAngle;
        }
        break;
      case 'zoom':
        if (selectedShape) {
          const currentDistance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
          const scaleFactor = currentDistance / startDistance;
          zoomShape(selectedShape, scaleFactor);
          startDistance = currentDistance;
        }
        break;
    }
  }
  
  function handleEnd() {
    if (!isDrawing) return;
    isDrawing = false;
    
    if (['line', 'rect', 'ellipse'].includes(currentOperation)) {
      // After creating a shape, switch to move operation
      currentOperation = 'move';
      document.querySelector('input[value="move"]').checked = true;
    }
    
    currentShape = null;
  }
  
  function createShape(x, y) {
    const lineWidth = parseInt(lineWidthInput.value);
    const color = colorInput.value;
    
    switch (currentOperation) {
      case 'line':
        currentShape = document.createElementNS(svgNS, 'line');
        currentShape.setAttribute('x1', x);
        currentShape.setAttribute('y1', y);
        currentShape.setAttribute('x2', x);
        currentShape.setAttribute('y2', y);
        currentShape.setAttribute('stroke', color);
        currentShape.setAttribute('stroke-width', lineWidth);
        break;
      case 'rect':
        currentShape = document.createElementNS(svgNS, 'rect');
        currentShape.setAttribute('x', x);
        currentShape.setAttribute('y', y);
        currentShape.setAttribute('width', 0);
        currentShape.setAttribute('height', 0);
        currentShape.setAttribute('stroke', color);
        currentShape.setAttribute('stroke-width', lineWidth);
        currentShape.setAttribute('fill', 'white');
        break;
      case 'ellipse':
        currentShape = document.createElementNS(svgNS, 'ellipse');
        currentShape.setAttribute('cx', x);
        currentShape.setAttribute('cy', y);
        currentShape.setAttribute('rx', 0);
        currentShape.setAttribute('ry', 0);
        currentShape.setAttribute('stroke', color);
        currentShape.setAttribute('stroke-width', lineWidth);
        currentShape.setAttribute('fill', 'white');
        break;
    }
    
    canvas.appendChild(currentShape);
  }
  
  function updateLine(x, y) {
    const lineWidth = parseInt(lineWidthInput.value);
    
    // Calculate length of the line
    const dx = x - startX;
    const dy = y - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // If length is less than line width, adjust end point
    if (length < lineWidth) {
      // Calculate unit vector in the direction of the line
      const unitX = dx / length || 0;
      const unitY = dy / length || 0;
      
      // Set the end point to be lineWidth distance from start
      x = startX + unitX * lineWidth;
      y = startY + unitY * lineWidth;
    }
    
    currentShape.setAttribute('x2', x);
    currentShape.setAttribute('y2', y);
  }
  
  function updateRect(x, y) {
    const lineWidth = parseInt(lineWidthInput.value);
    
    let width = Math.abs(x - startX);
    let height = Math.abs(y - startY);
    
    // Ensure minimum dimensions are at least the line width
    width = Math.max(width, lineWidth);
    height = Math.max(height, lineWidth);
    
    // Calculate the top-left corner
    const rectX = x < startX ? startX - width : startX;
    const rectY = y < startY ? startY - height : startY;
    
    currentShape.setAttribute('x', rectX);
    currentShape.setAttribute('y', rectY);
    currentShape.setAttribute('width', width);
    currentShape.setAttribute('height', height);
  }
  
  function updateEllipse(x, y) {
    const lineWidth = parseInt(lineWidthInput.value);
    
    // Calculate width and height of the bounding rectangle
    const width = Math.abs(x - startX);
    const height = Math.abs(y - startY);
    
    // Calculate center of the ellipse
    const cx = startX + (x - startX) / 2;
    const cy = startY + (y - startY) / 2;
    
    // Calculate radii (half of width and height)
    let rx = width / 2;
    let ry = height / 2;
    
    // Ensure minimum radii are at least half the line width
    rx = Math.max(rx, lineWidth / 2);
    ry = Math.max(ry, lineWidth / 2);
    
    currentShape.setAttribute('cx', cx);
    currentShape.setAttribute('cy', cy);
    currentShape.setAttribute('rx', rx);
    currentShape.setAttribute('ry', ry);
  }
  
  function findShapeAtPosition(x, y) {
    // Get all shapes in the canvas
    const shapes = canvas.querySelectorAll('line, rect, ellipse');
    
    // Check each shape in reverse order (top to bottom)
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      
      // Simple hit testing based on shape type
      if (isPointInShape(shape, x, y)) {
        return shape;
      }
    }
    
    return null;
  }
  
  function isPointInShape(shape, x, y) {
    // Get the bounding box of the shape
    const bbox = shape.getBBox();
    
    // Add some padding for easier selection
    const padding = parseInt(shape.getAttribute('stroke-width')) || 2;
    
    // Check if point is within the bounding box with padding
    return (
      x >= bbox.x - padding &&
      x <= bbox.x + bbox.width + padding &&
      y >= bbox.y - padding &&
      y <= bbox.y + bbox.height + padding
    );
  }
  
  function moveShape(shape, dx, dy) {
    // Get current transform or create a new one
    let transform = shape.getAttribute('transform') || '';
    
    // Extract existing translate values if any
    let translateX = 0;
    let translateY = 0;
    
    const translateMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
    if (translateMatch) {
      translateX = parseFloat(translateMatch[1]);
      translateY = parseFloat(translateMatch[2]);
      
      // Remove the old translate from the transform string
      transform = transform.replace(/translate\([^)]+\)\s*/, '');
    }
    
    // Add the new translate
    const newTranslateX = translateX + dx;
    const newTranslateY = translateY + dy;
    
    // Update the transform attribute
    shape.setAttribute('transform', `translate(${newTranslateX}, ${newTranslateY}) ${transform}`.trim());
    
    // Update center coordinates for rotate and zoom operations
    const bbox = shape.getBBox();
    centerX = bbox.x + bbox.width / 2;
    centerY = bbox.y + bbox.height / 2;
  }
  
  function rotateShape(shape, angleDelta) {
    // Get current transform or create a new one
    let transform = shape.getAttribute('transform') || '';
    
    // Extract existing rotate values if any
    let currentAngle = 0;
    
    const rotateMatch = transform.match(/rotate\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
    if (rotateMatch) {
      currentAngle = parseFloat(rotateMatch[1]);
      
      // Remove the old rotate from the transform string
      transform = transform.replace(/rotate\([^)]+\)\s*/, '');
    }
    
    // Add the new rotation
    const newAngle = currentAngle + angleDelta;
    
    // Update the transform attribute
    shape.setAttribute('transform', `rotate(${newAngle}, ${centerX}, ${centerY}) ${transform}`.trim());
  }
  
  function getScaleFromTransform(transform) {
    if (!transform) return 1;
    
    const scaleMatch = transform.match(/scale\(([^)]+)\)/);
    if (scaleMatch) {
      return parseFloat(scaleMatch[1]);
    }
    
    return 1;
  }
  
  function zoomShape(shape, scaleFactor) {
    // Get current transform or create a new one
    let transform = shape.getAttribute('transform') || '';
    
    // Extract existing scale values if any
    let currentScale = 1;
    
    const scaleMatch = transform.match(/scale\(([^)]+)\)/);
    if (scaleMatch) {
      currentScale = parseFloat(scaleMatch[1]);
      
      // Remove the old scale from the transform string
      transform = transform.replace(/scale\([^)]+\)\s*/, '');
    }
    
    // Calculate the new scale
    const newScale = currentScale * scaleFactor;
    
    // Update the transform attribute
    shape.setAttribute('transform', `scale(${newScale}) ${transform}`.trim());
  }
  
  function copyShape(shape) {
    // Clone the shape
    const clone = shape.cloneNode(true);
    
    // Get the current transform or create a new one
    let transform = clone.getAttribute('transform') || '';
    
    // Extract existing translate values if any
    let translateX = 0;
    let translateY = 0;
    
    const translateMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
    if (translateMatch) {
      translateX = parseFloat(translateMatch[1]);
      translateY = parseFloat(translateMatch[2]);
      
      // Remove the old translate from the transform string
      transform = transform.replace(/translate\([^)]+\)\s*/, '');
    }
    
    // Add 20px to the right and 20px down
    const newTranslateX = translateX + 20;
    const newTranslateY = translateY + 20;
    
    // Update the transform attribute
    clone.setAttribute('transform', `translate(${newTranslateX}, ${newTranslateY}) ${transform}`.trim());
    
    // Add the clone to the canvas
    canvas.appendChild(clone);
    
    // Set the current operation to move and select the new shape
    currentOperation = 'move';
    document.querySelector('input[value="move"]').checked = true;
    selectedShape = clone;
  }
  
  function deleteShape(shape) {
    // Remove the shape from the canvas
    canvas.removeChild(shape);
    
    // If the deleted shape was selected, clear the selection
    if (selectedShape === shape) {
      selectedShape = null;
    }
  }
  
  function fillShape(shape) {
    // Get the current color
    const color = colorInput.value;
    
    // Set the fill color of the shape
    shape.setAttribute('fill', color);
  }
});