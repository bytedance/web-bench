import React, { useState, forwardRef } from 'react';
import { useCommentStore } from '../store/Comment';
import { toast } from '../utils/toast';

interface CommentsProps {
  blogTitle: string;
}

const Comments = forwardRef<HTMLTextAreaElement, CommentsProps>(({ blogTitle }, ref) => {
  const { getCommentsByBlog, addComment } = useCommentStore();
  const [commentText, setCommentText] = useState('');
  const comments = getCommentsByBlog(blogTitle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(blogTitle, commentText.trim());
      setCommentText('');
      toast('New Comment Created Successfully!', 2000);
    }
  };

  return (
    <div style={{ marginTop: '30px', borderTop: '1px solid #e1e1e1', paddingTop: '20px' }}>
      <h3 style={{ marginBottom: '15px' }}>Comments</h3>
      
      {comments.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          {comments.map((comment, index) => (
            <div 
              key={index} 
              className="comment-item"
              style={{
                padding: '10px 15px',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                marginBottom: '10px'
              }}
            >
              {comment}
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <textarea
          ref={ref}
          placeholder="Enter Your Comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            minHeight: '80px',
            marginBottom: '10px',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
        <button 
          type="submit"
          className="comment-btn"
          style={{
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Submit Comment
        </button>
      </form>
    </div>
  );
});

export default Comments;