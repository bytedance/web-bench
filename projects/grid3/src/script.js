class DragHandler {
    constructor() {
        this.isDragging = false;
        this.currentDrag = null;
        this.startX = 0;
        this.startY = 0;
        this.originalWidth = 0;
        this.originalHeight = 0;
        this.init();
    }

    init() {
        const leftDrag = document.querySelector('.left-drag');
        const rightDrag = document.querySelector('.right-drag');
        const content = document.querySelector('.content');

        leftDrag.addEventListener('mousedown', (e) => this.startDrag(e, 'left'));
        rightDrag.addEventListener('mousedown', (e) => this.startDrag(e, 'right'));
        
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
        
        this.content = content;
    }

    startDrag(e, direction) {
        this.isDragging = true;
        this.currentDrag = direction;
        this.startX = e.clientX;
        this.startY = e.clientY;
        
        const contentRect = this.content.getBoundingClientRect();
        this.originalWidth = contentRect.width;
        this.originalHeight = contentRect.height;
        
        e.preventDefault();
    }

    drag(e) {
        if (!this.isDragging) return;

        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;
        const root = document.querySelector('.root');
        
        if (window.innerWidth < 400) {
            if (this.currentDrag === 'right') {
                const newHeight = this.originalHeight + deltaY;
                if (newHeight > 100) {
                    this.content.style.height = newHeight + 'px';
                }
            }
        } else {
            if (this.currentDrag === 'left') {
                const newWidth = this.originalWidth - deltaX;
                if (newWidth > 100) {
                    this.content.style.width = newWidth + 'px';
                }
            } else if (this.currentDrag === 'right') {
                const newWidth = this.originalWidth + deltaX;
                if (newWidth > 100) {
                    this.content.style.width = newWidth + 'px';
                }
            }
        }
    }

    stopDrag() {
        if (this.isDragging) {
            this.isDragging = false;
            this.currentDrag = null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DragHandler();
});