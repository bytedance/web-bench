import React from 'react';

interface HeaderProps {
  onAddBlog?: () => void;
  blogListLength?: number;
}

const Header: React.FC<HeaderProps> = ({ onAddBlog, blogListLength }) => {
  return (
    <div style={{
      backgroundColor: '#4a90e2',
      color: 'white',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1>Hello Blog</h1>
        {blogListLength !== undefined && (
          <span className="blog-list-len" style={{ marginLeft: '10px', fontSize: '16px' }}>
            {blogListLength}
          </span>
        )}
      </div>
      {onAddBlog && (
        <button 
          onClick={onAddBlog}
          style={{
            backgroundColor: '#2c6ed5',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Add Blog
        </button>
      )}
    </div>
  );
};

export default Header;