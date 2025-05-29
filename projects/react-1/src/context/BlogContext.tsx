import React, { createContext, useState, useContext, ReactNode } from 'react';
import { BlogType } from '../components/Blog';

interface BlogContextType {
  blogs: BlogType[];
  selectedBlog: BlogType | null;
  setBlogs: React.Dispatch<React.SetStateAction<BlogType[]>>;
  setSelectedBlog: React.Dispatch<React.SetStateAction<BlogType | null>>;
  addBlog: (blog: BlogType) => void;
  updateBlog: (updatedBlog: BlogType) => void;
  deleteBlog: () => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlogContext must be used within a BlogProvider');
  }
  return context;
};

interface BlogProviderProps {
  children: ReactNode;
}

export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  // Initial mock data
  const initialBlogs: BlogType[] = [
    { title: 'Morning', detail: 'Morning My Friends' },
    { title: 'Travel', detail: 'I love traveling!' }
  ];

  const [blogs, setBlogs] = useState<BlogType[]>(initialBlogs);
  const [selectedBlog, setSelectedBlog] = useState<BlogType | null>(initialBlogs[0]);

  const addBlog = (blog: BlogType) => {
    setBlogs(prevBlogs => [...prevBlogs, blog]);
    setSelectedBlog(blog);
  };

  const updateBlog = (updatedBlog: BlogType) => {
    setBlogs(prevBlogs => 
      prevBlogs.map(blog => 
        blog.title === selectedBlog?.title ? updatedBlog : blog
      )
    );
    setSelectedBlog(updatedBlog);
  };

  const deleteBlog = () => {
    if (!selectedBlog) return;
    
    setBlogs(prevBlogs => prevBlogs.filter(blog => blog.title !== selectedBlog.title));
    
    // Select the first blog after deletion or null if no blogs remain
    setSelectedBlog(blogs.length > 1 ? 
      blogs.find(blog => blog.title !== selectedBlog.title) || null : null
    );
  };

  const value = {
    blogs,
    selectedBlog,
    setBlogs,
    setSelectedBlog,
    addBlog,
    updateBlog,
    deleteBlog
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};