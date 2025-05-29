import React, { useState } from 'react';
import Blog, { BlogType } from './Blog';
import BlogList from './BlogList';
import Search from './Search';

interface MainProps {
  blogs: BlogType[];
  selectedBlog: BlogType | null;
  onSelectBlog: (blog: BlogType) => void;
  onDeleteBlog?: () => void;
  onEditBlog?: () => void;
}

const Main: React.FC<MainProps> = ({ 
  blogs, 
  selectedBlog, 
  onSelectBlog,
  onDeleteBlog,
  onEditBlog
 }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ 
      display: 'flex', 
      height: 'calc(100vh - 80px)',
      overflow: 'hidden'
    }}>
      <div style={{ 
        width: '300px', 
        borderRight: '1px solid #e1e1e1',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Search onSearch={setSearchTerm} />
        <BlogList 
          blogs={filteredBlogs} 
          selectedBlog={selectedBlog} 
          onSelectBlog={onSelectBlog} 
        />
      </div>
      <div style={{ 
        flex: 1, 
        overflow: 'auto',
        padding: '0 20px'
      }}>
        {selectedBlog && (
          <Blog 
            blog={selectedBlog} 
            onDelete={onDeleteBlog}
            onEdit={onEditBlog}
          />
        )}
      </div>
    </div>
  );
};

export default Main;