let isDragging = false;
let currentDragger = null;
let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;

const leftDrag = document.querySelector('.left-drag');
const rightDrag = document.querySelector('.right-drag');
const content = document.querySelector('.content');

function initDraggers() {
    leftDrag.addEventListener('mousedown', startDrag);
    rightDrag.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

function startDrag(e) {
    isDragging = true;
    currentDragger = e.target;
    startX = e.clientX;
    startY = e.clientY;
    
    const contentRect = content.getBoundingClientRect();
    startWidth = contentRect.width;
    startHeight = contentRect.height;
    
    e.preventDefault();
}

function drag(e) {
    if (!isDragging || !currentDragger) return;
    
    const isSmallScreen = window.innerWidth < 400;
    
    if (currentDragger === leftDrag && !isSmallScreen) {
        const deltaX = e.clientX - startX;
        const newWidth = startWidth - deltaX;
        if (newWidth > 100) {
            content.style.width = newWidth + 'px';
        }
    } else if (currentDragger === rightDrag) {
        if (isSmallScreen) {
            const deltaY = e.clientY - startY;
            const newHeight = startHeight + deltaY;
            if (newHeight > 100) {
                content.style.height = newHeight + 'px';
            }
        } else {
            const deltaX = e.clientX - startX;
            const newWidth = startWidth + deltaX;
            if (newWidth > 100) {
                content.style.width = newWidth + 'px';
            }
        }
    }
}

function stopDrag() {
    isDragging = false;
    currentDragger = null;
}

function handleResize() {
    if (window.innerWidth >= 400) {
        content.style.height = '';
    } else {
        content.style.width = '';
    }
}

window.addEventListener('resize', handleResize);
document.addEventListener('DOMContentLoaded', initDraggers);