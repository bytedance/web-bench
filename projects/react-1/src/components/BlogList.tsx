import React from 'react';
import { BlogType } from './Blog';

interface BlogListProps {
  blogs: BlogType[];
  selectedBlog: BlogType | null;
  onSelectBlog: (blog: BlogType) => void;
}

const BlogList: React.FC<BlogListProps> = ({ blogs, selectedBlog, onSelectBlog }) => {
  return (
    <div style={{ 
      overflowY: 'auto',
      flex: 1
    }}>
      {blogs.map((blog, index) => (
        <div 
          key={index} 
          className="list-item"
          onClick={() => onSelectBlog(blog)}
          style={{
            padding: '10px 15px',
            height: '40px',
            boxSizing: 'border-box',
            cursor: 'pointer',
            backgroundColor: selectedBlog && selectedBlog.title === blog.title ? '#e6f2ff' : 'transparent',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            transition: 'background-color 0.2s ease'
          }}
        >
          {blog.title}
        </div>
      ))}
    </div>
  );
};

export default BlogList;