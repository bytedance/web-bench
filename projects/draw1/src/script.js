class SVGDrawingTool {
    constructor() {
        this.canvas = document.querySelector('.canvas');
        this.lineWidthInput = document.querySelector('.line-width');
        this.colorInput = document.querySelector('.color');
        this.operationInputs = document.querySelectorAll('input[name="operation"]');
        
        this.currentOperation = 'move';
        this.isDrawing = false;
        this.isSpacePressed = false;
        this.originalOperation = null;
        this.startPoint = { x: 0, y: 0 };
        this.selectedElement = null;
        this.elementTransforms = new Map();
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateOperation();
    }
    
    setupEventListeners() {
        // Operation selection
        this.operationInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.currentOperation = input.value;
                this.updateOperation();
            });
        });
        
        // Canvas events
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // Touch events
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // Keyboard events
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        // Prevent default touch behaviors
        this.canvas.addEventListener('touchstart', e => e.preventDefault());
        this.canvas.addEventListener('touchmove', e => e.preventDefault());
    }
    
    updateOperation() {
        const operation = this.currentOperation;
        document.querySelector(`input[value="${operation}"]`).checked = true;
        
        if (['line', 'rect', 'ellipse'].includes(operation)) {
            this.canvas.style.cursor = 'crosshair';
        } else if (operation === 'move') {
            this.canvas.style.cursor = 'move';
        } else if (operation === 'rotate') {
            this.canvas.style.cursor = 'grab';
        } else if (operation === 'zoom') {
            this.canvas.style.cursor = 'zoom-in';
        } else {
            this.canvas.style.cursor = 'pointer';
        }
    }
    
    handleKeyDown(e) {
        if (e.code === 'Space' && !this.isSpacePressed) {
            e.preventDefault();
            this.isSpacePressed = true;
            this.originalOperation = this.currentOperation;
            this.currentOperation = 'move';
            this.updateOperation();
        }
    }
    
    handleKeyUp(e) {
        if (e.code === 'Space' && this.isSpacePressed) {
            e.preventDefault();
            this.isSpacePressed = false;
            if (this.originalOperation) {
                this.currentOperation = this.originalOperation;
                this.originalOperation = null;
                this.updateOperation();
            }
        }
    }
    
    getEventPosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
    
    handleMouseDown(e) {
        this.handlePointerDown(e);
    }
    
    handleTouchStart(e) {
        this.handlePointerDown(e);
    }
    
    handlePointerDown(e) {
        const pos = this.getEventPosition(e);
        this.startPoint = pos;
        this.isDrawing = true;
        
        if (['line', 'rect', 'ellipse'].includes(this.currentOperation)) {
            this.startDrawing(pos);
        } else if (['move', 'rotate', 'zoom'].includes(this.currentOperation)) {
            this.selectedElement = this.getElementAt(pos);
            if (this.selectedElement) {
                this.startTransform(pos);
            }
        } else if (['copy', 'delete', 'fill'].includes(this.currentOperation)) {
            const element = this.getElementAt(pos);
            if (element) {
                this.performAction(element);
            }
        }
    }
    
    handleMouseMove(e) {
        this.handlePointerMove(e);
    }
    
    handleTouchMove(e) {
        this.handlePointerMove(e);
    }
    
    handlePointerMove(e) {
        if (!this.isDrawing) return;
        
        const pos = this.getEventPosition(e);
        
        if (['line', 'rect', 'ellipse'].includes(this.currentOperation)) {
            this.updateDrawing(pos);
        } else if (this.selectedElement && ['move', 'rotate', 'zoom'].includes(this.currentOperation)) {
            this.updateTransform(pos);
        }
    }
    
    handleMouseUp(e) {
        this.handlePointerUp(e);
    }
    
    handleTouchEnd(e) {
        this.handlePointerUp(e);
    }
    
    handlePointerUp(e) {
        if (!this.isDrawing) return;
        
        this.isDrawing = false;
        
        if (['line', 'rect', 'ellipse'].includes(this.currentOperation)) {
            this.finishDrawing();
        } else if (this.selectedElement) {
            this.finishTransform();
        }
    }
    
    startDrawing(pos) {
        const lineWidth = this.lineWidthInput.value;
        const color = this.colorInput.value;
        
        if (this.currentOperation === 'line') {
            this.currentElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            this.currentElement.setAttribute('x1', pos.x);
            this.currentElement.setAttribute('y1', pos.y);
            this.currentElement.setAttribute('x2', pos.x);
            this.currentElement.setAttribute('y2', pos.y);
            this.currentElement.setAttribute('stroke', color);
            this.currentElement.setAttribute('stroke-width', lineWidth);
            this.currentElement.setAttribute('stroke-linecap', 'round');
        } else if (this.currentOperation === 'rect') {
            this.currentElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            this.currentElement.setAttribute('x', pos.x);
            this.currentElement.setAttribute('y', pos.y);
            this.currentElement.setAttribute('width', 0);
            this.currentElement.setAttribute('height', 0);
            this.currentElement.setAttribute('fill', 'white');
            this.currentElement.setAttribute('stroke', color);
            this.currentElement.setAttribute('stroke-width', lineWidth);
        } else if (this.currentOperation === 'ellipse') {
            this.currentElement = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
            this.currentElement.setAttribute('cx', pos.x);
            this.currentElement.setAttribute('cy', pos.y);
            this.currentElement.setAttribute('rx', 0);
            this.currentElement.setAttribute('ry', 0);
            this.currentElement.setAttribute('fill', 'white');
            this.currentElement.setAttribute('stroke', color);
            this.currentElement.setAttribute('stroke-width', lineWidth);
        }
        
        this.canvas.appendChild(this.currentElement);
    }
    
    updateDrawing(pos) {
        const lineWidth = parseInt(this.lineWidthInput.value);
        
        if (this.currentOperation === 'line') {
            const dx = pos.x - this.startPoint.x;
            const dy = pos.y - this.startPoint.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            
            if (length < lineWidth) {
                const angle = Math.atan2(dy, dx);
                pos.x = this.startPoint.x + Math.cos(angle) * lineWidth;
                pos.y = this.startPoint.y + Math.sin(angle) * lineWidth;
            }
            
            this.currentElement.setAttribute('x2', pos.x);
            this.currentElement.setAttribute('y2', pos.y);
        } else if (this.currentOperation === 'rect') {
            const width = Math.abs(pos.x - this.startPoint.x);
            const height = Math.abs(pos.y - this.startPoint.y);
            const x = Math.min(this.startPoint.x, pos.x);
            const y = Math.min(this.startPoint.y, pos.y);
            
            const finalWidth = Math.max(width, lineWidth);
            const finalHeight = Math.max(height, lineWidth);
            
            this.currentElement.setAttribute('x', x);
            this.currentElement.setAttribute('y', y);
            this.currentElement.setAttribute('width', finalWidth);
            this.currentElement.setAttribute('height', finalHeight);
        } else if (this.currentOperation === 'ellipse') {
            const width = Math.abs(pos.x - this.startPoint.x);
            const height = Math.abs(pos.y - this.startPoint.y);
            const cx = (this.startPoint.x + pos.x) / 2;
            const cy = (this.startPoint.y + pos.y) / 2;
            
            const rx = Math.max(width / 2, lineWidth / 2);
            const ry = Math.max(height / 2, lineWidth / 2);
            
            this.currentElement.setAttribute('cx', cx);
            this.currentElement.setAttribute('cy', cy);
            this.currentElement.setAttribute('rx', rx);
            this.currentElement.setAttribute('ry', ry);
        }
    }
    
    finishDrawing() {
        if (this.currentElement) {
            this.setElementTransform(this.currentElement, { x: 0, y: 0, rotation: 0, scale: 1 });
            this.currentElement = null;
            this.currentOperation = 'move';
            this.updateOperation();
        }
    }
    
    getElementAt(pos) {
        const elements = Array.from(this.canvas.children);
        for (let i = elements.length - 1; i >= 0; i--) {
            const element = elements[i];
            const bounds = this.getElementBounds(element);
            if (this.isPointInBounds(pos, bounds)) {
                return element;
            }
        }
        return null;
    }
    
    getElementBounds(element) {
        const bbox = element.getBBox();
        return {
            x: bbox.x,
            y: bbox.y,
            width: bbox.width,
            height: bbox.height,
            centerX: bbox.x + bbox.width / 2,
            centerY: bbox.y + bbox.height / 2
        };
    }
    
    isPointInBounds(pos, bounds) {
        return pos.x >= bounds.x && pos.x <= bounds.x + bounds.width &&
               pos.y >= bounds.y && pos.y <= bounds.y + bounds.height;
    }
    
    performAction(element) {
        if (this.currentOperation === 'copy') {
            this.copyElement(element);
        } else if (this.currentOperation === 'delete') {
            this.deleteElement(element);
        } else if (this.currentOperation === 'fill') {
            this.fillElement(element);
        }
    }
    
    copyElement(element) {
        const clone = element.cloneNode(true);
        const transform = this.getElementTransform(element);
        const newTransform = {
            x: transform.x + 20,
            y: transform.y + 20,
            rotation: transform.rotation,
            scale: transform.scale
        };
        
        this.setElementTransform(clone, newTransform);
        this.canvas.appendChild(clone);
        
        this.currentOperation = 'move';
        this.updateOperation();
    }
    
    deleteElement(element) {
        this.elementTransforms.delete(element);
        element.remove();
    }
    
    fillElement(element) {
        const color = this.colorInput.value;
        if (element.tagName !== 'line') {
            element.setAttribute('fill', color);
        }
    }
    
    startTransform(pos) {
        this.transformStart = {
            mouseX: pos.x,
            mouseY: pos.y,
            transform: this.getElementTransform(this.selectedElement)
        };
    }
    
    updateTransform(pos) {
        const start = this.transformStart;
        const transform = { ...start.transform };
        const bounds = this.getElementBounds(this.selectedElement);
        
        if (this.currentOperation === 'move') {
            transform.x = start.transform.x + (pos.x - start.mouseX);
            transform.y = start.transform.y + (pos.y - start.mouseY);
        } else if (this.currentOperation === 'rotate') {
            const centerX = bounds.centerX + start.transform.x;
            const centerY = bounds.centerY + start.transform.y;
            
            const startAngle = Math.atan2(start.mouseY - centerY, start.mouseX - centerX);
            const currentAngle = Math.atan2(pos.y - centerY, pos.x - centerX);
            const deltaAngle = (currentAngle - startAngle) * 180 / Math.PI;
            
            transform.rotation = start.transform.rotation + deltaAngle;
        } else if (this.currentOperation === 'zoom') {
            const centerX = bounds.centerX + start.transform.x;
            const centerY = bounds.centerY + start.transform.y;
            
            const startDistance = Math.sqrt(
                Math.pow(start.mouseX - centerX, 2) + Math.pow(start.mouseY - centerY, 2)
            );
            const currentDistance = Math.sqrt(
                Math.pow(pos.x - centerX, 2) + Math.pow(pos.y - centerY, 2)
            );
            
            if (startDistance > 0) {
                const scaleFactor = currentDistance / startDistance;
                transform.scale = Math.max(0.1, start.transform.scale * scaleFactor);
            }
        }
        
        this.setElementTransform(this.selectedElement, transform);
    }
    
    finishTransform() {
        this.selectedElement = null;
        this.transformStart = null;
    }
    
    getElementTransform(element) {
        if (!this.elementTransforms.has(element)) {
            this.elementTransforms.set(element, { x: 0, y: 0, rotation: 0, scale: 1 });
        }
        return this.elementTransforms.get(element);
    }
    
    setElementTransform(element, transform) {
        this.elementTransforms.set(element, transform);
        
        const bounds = this.getElementBounds(element);
        const centerX = bounds.centerX;
        const centerY = bounds.centerY;
        
        let transformString = '';
        
        if (transform.x !== 0 || transform.y !== 0) {
            transformString += `translate(${transform.x}, ${transform.y}) `;
        }
        
        if (transform.rotation !== 0) {
            transformString += `rotate(${transform.rotation}, ${centerX}, ${centerY}) `;
        }
        
        if (transform.scale !== 1) {
            transformString += `scale(${transform.scale}) translate(${-centerX * (transform.scale - 1) / transform.scale}, ${-centerY * (transform.scale - 1) / transform.scale}) `;
        }
        
        if (transformString) {
            element.setAttribute('transform', transformString.trim());
        } else {
            element.removeAttribute('transform');
        }
    }
}

// Initialize the drawing tool when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SVGDrawingTool();
});