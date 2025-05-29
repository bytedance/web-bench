import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import Main from './components/Main';
import BlogForm from './components/BlogForm';
import { BlogProvider, useBlogContext } from './context/BlogContext';
import { useDelete } from './hooks/useDelete';
import { useEdit } from './hooks/useEdit';
import Tooltip from './components/Tooltip';
import { toast } from './utils/toast';
import TruncatedTitle from './components/TruncatedTitle';
import Comments from './components/Comments';

const AppContent: React.FC = () => {
  const { blogs, selectedBlog, setSelectedBlog, addBlog } = useBlogContext();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { handleDelete } = useDelete();
  const { isEditing, blogToEdit, handleEdit, handleCloseEdit, handleSubmitEdit } = useEdit();
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Check if there's a game record blog to add
    const gameRecordBlog = sessionStorage.getItem('gameRecordBlog');
    if (gameRecordBlog) {
      try {
        const blog = JSON.parse(gameRecordBlog);
        addBlog(blog);
        toast('Game Record Blog Added!', 2000);
        sessionStorage.removeItem('gameRecordBlog');
      } catch (error) {
        console.error('Failed to parse game record blog', error);
      }
    }
  }, [addBlog]);

  const handleAddBlog = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    handleCloseEdit();
  };

  const handleSubmitForm = (blog: { title: string; detail: string }) => {
    if (isEditing) {
      handleSubmitEdit(blog);
      toast('Blog Updated Successfully!', 2000);
    } else {
      addBlog(blog);
      toast('New Blog Created Successfully!', 2000);
    }
  };

  const handleFastComment = () => {
    if (commentTextareaRef.current) {
      commentTextareaRef.current.focus();
      commentTextareaRef.current.value = 'Charming Blog!';
    }
  };

  const handleGenerateRandomBlogs = () => {
    const randomBlogs = [];
    for (let i = 0; i < 100000; i++) {
      const randomDigits = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
      randomBlogs.push({
        title: `RandomBlog-${randomDigits}`,
        detail: `This is random blog ${i + 1}`
      });
    }
    
    // Use a more efficient way to add blogs
    const addBlogsInBatches = (blogs: any[], startIndex: number, batchSize: number) => {
      if (startIndex >= blogs.length) return;
      
      const endIndex = Math.min(startIndex + batchSize, blogs.length);
      const batch = blogs.slice(startIndex, endIndex);
      
      addBlog({ title: 'Processing...', detail: `Adding blogs ${startIndex + 1} to ${endIndex}` });
      
      // Use setTimeout to avoid blocking the UI
      setTimeout(() => {
        batch.forEach(blog => addBlog(blog));
        addBlogsInBatches(blogs, endIndex, batchSize);
      }, 0);
    };
    
    addBlogsInBatches(randomBlogs, 0, 1000);
  };

  return (
    <div className="App">
      <Header 
        onAddBlog={handleAddBlog} 
        blogListLength={blogs.length} 
      />
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        padding: '10px 20px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #e1e1e1'
      }}>
        <Tooltip text="Write a New Blog For everyone">
          <button 
            onClick={handleAddBlog}
            style={{
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '4px',
              marginRight: '10px',
              cursor: 'pointer'
            }}
          >
            Add Blog
          </button>
        </Tooltip>
        
        <button 
          onClick={handleFastComment}
          style={{
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          Fast Comment
        </button>
        
        <button 
          onClick={handleGenerateRandomBlogs}
          style={{
            backgroundColor: '#9b59b6',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          Random Blogs
        </button>
        
        <button 
          onClick={() => window.location.href = '/game'}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🎮
        </button>
      </div>
      
      <Main 
        blogs={blogs}
        selectedBlog={selectedBlog}
        onSelectBlog={setSelectedBlog}
        onDeleteBlog={handleDelete}
        onEditBlog={handleEdit}
      />
      
      {selectedBlog && (
        <div style={{ padding: '0 20px 20px 320px' }}>
          <Comments 
            blogTitle={selectedBlog.title} 
            ref={commentTextareaRef}
          />
        </div>
      )}
      
      <BlogForm 
        visible={isFormVisible || isEditing}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        editBlog={isEditing ? blogToEdit : undefined}
        blogs={blogs}
      />
    </div>
  );
};

function App() {
  return (
    <BlogProvider>
      <AppContent />
    </BlogProvider>
  );
}

export default App;
