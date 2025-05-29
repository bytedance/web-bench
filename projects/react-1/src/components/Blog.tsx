import React from 'react';
import TruncatedTitle from './TruncatedTitle';
import Comments from './Comments';

export interface BlogType {
  title: string;
  detail: string;
}

interface BlogProps {
  blog: BlogType;
  onDelete?: () => void;
  onEdit?: () => void;
}

const Blog: React.FC<BlogProps> = ({ blog, onDelete, onEdit }) => {
  // Function to render markdown content
  const renderMarkdown = (content: string) => {
    // Simple markdown rendering for headers, bold, italic, code blocks
    let html = content
      // Headers
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Line breaks
      .replace(/\n/g, '<br />');
    
    // Sanitize to prevent XSS
    const sanitizeHtml = (html: string) => {
      const temp = document.createElement('div');
      temp.textContent = html;
      return temp.innerHTML;
    };
    
    // Only allow specific HTML tags
    const allowedTags = ['h1', 'h2', 'h3', 'strong', 'em', 'pre', 'code', 'br'];
    const sanitized = sanitizeHtml(html);
    
    return { __html: sanitized };
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <TruncatedTitle 
          title={blog.title}
          className="blog-title"
          style={{ 
            fontSize: '24px',
            margin: 0
          }}
        />
        {(onEdit || onDelete) && (
          <div>
            {onEdit && (
              <button 
                className="edit-btn"
                onClick={onEdit}
                style={{
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  marginRight: '10px',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button 
                className="delete-btn"
                onClick={onDelete}
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
      <div 
        style={{ lineHeight: '1.6' }}
        dangerouslySetInnerHTML={renderMarkdown(blog.detail)}
      />
      
      <Comments blogTitle={blog.title} />
    </div>
  );
};

export default Blog;