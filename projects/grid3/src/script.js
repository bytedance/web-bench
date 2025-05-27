// src/script.js
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