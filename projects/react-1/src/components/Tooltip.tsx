import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  text: string;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const childRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (childRef.current) {
      const rect = childRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX
      });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
    }
  }, [isVisible]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${position.top}px`,
    left: `${position.left}px`,
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '14px',
    zIndex: 1000,
    pointerEvents: 'none',
    whiteSpace: 'nowrap'
  };

  return (
    <>
      <div 
        ref={childRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ display: 'inline-block' }}
      >
        {children}
      </div>
      
      {isVisible && createPortal(
        <div className="tooltip" ref={tooltipRef} style={tooltipStyle}>
          {text}
        </div>,
        document.body
      )}
    </>
  );
};

export default Tooltip;