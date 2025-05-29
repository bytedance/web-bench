import React, { useRef, useState, useEffect } from 'react';
import Tooltip from './Tooltip';

interface TruncatedTitleProps {
  title: string;
  maxWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

const TruncatedTitle: React.FC<TruncatedTitleProps> = ({ 
  title, 
  maxWidth = 300,
  className = '',
  style = {}
}) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      if (titleRef.current) {
        setIsTruncated(titleRef.current.scrollWidth > titleRef.current.clientWidth);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    
    return () => {
      window.removeEventListener('resize', checkTruncation);
    };
  }, [title]);

  const titleStyle: React.CSSProperties = {
    ...style,
    maxWidth: `${maxWidth}px`,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block'
  };

  if (isTruncated) {
    return (
      <Tooltip text={title}>
        <div 
          ref={titleRef} 
          className={className} 
          style={titleStyle}
        >
          {title}
        </div>
      </Tooltip>
    );
  }

  return (
    <div 
      ref={titleRef} 
      className={className} 
      style={titleStyle}
    >
      {title}
    </div>
  );
};

export default TruncatedTitle;