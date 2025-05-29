import React, { useState, useEffect } from 'react';
import { BlogType } from './Blog';

interface BlogFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (blog: BlogType) => void;
  editBlog?: BlogType;
  blogs?: BlogType[];
}

const BlogForm: React.FC<BlogFormProps> = ({ 
  visible, 
  onClose, 
  onSubmit, 
  editBlog,
  blogs = []
}) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (visible) {
      setVisibleCount(prev => prev + 1);
    }
  }, [visible]);

  useEffect(() => {
    if (editBlog) {
      setTitle(editBlog.title);
      setDetail(editBlog.detail);
    } else {
      setTitle('');
      setDetail('');
    }
    setTitleError('');
  }, [editBlog, visible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }

    // Check for duplicate title when creating a new blog
    if (!editBlog && blogs.some(blog => blog.title === title.trim())) {
      setTitleError('A blog with this title already exists');
      return;
    }

    // Check for duplicate title when editing (excluding the current blog)
    if (editBlog && blogs.some(blog => blog.title === title.trim() && blog.title !== editBlog.title)) {
      setTitleError('A blog with this title already exists');
      return;
    }

    onSubmit({ title: title.trim(), detail: detail.trim() });
    onClose();
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '500px',
        padding: '20px',
        position: 'relative'
      }}>
        <span className="visible-count" style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          fontSize: '12px',
          color: '#888'
        }}>
          {visibleCount}
        </span>
        
        <button 
          className="close-btn"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          x
        </button>
        
        <h2 style={{ marginTop: '10px', marginBottom: '20px' }}>
          {editBlog ? 'Edit Blog' : 'Create Blog'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label 
              htmlFor="title" 
              style={{ 
                display: 'block', 
                marginBottom: '5px',
                fontWeight: 'bold'
              }}
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError('');
              }}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: `1px solid ${titleError ? 'red' : '#ddd'}`,
                boxSizing: 'border-box'
              }}
            />
            {titleError && (
              <p style={{ color: 'red', margin: '5px 0 0', fontSize: '14px' }}>
                {titleError}
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="detail" 
              style={{ 
                display: 'block', 
                marginBottom: '5px',
                fontWeight: 'bold'
              }}
            >
              Detail
            </label>
            <textarea
              id="detail"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                minHeight: '150px',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>
          
          <button 
            type="submit"
            className="submit-btn"
            style={{
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              float: 'right'
            }}
          >
            {editBlog ? 'Update' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;