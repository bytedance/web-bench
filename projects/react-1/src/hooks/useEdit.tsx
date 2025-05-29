import { useState, useCallback } from 'react';
import { useBlogContext } from '../context/BlogContext';
import { BlogType } from '../components/Blog';

export const useEdit = () => {
  const { selectedBlog, updateBlog } = useBlogContext();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleSubmitEdit = useCallback((updatedBlog: BlogType) => {
    updateBlog(updatedBlog);
    setIsEditing(false);
  }, [updateBlog]);

  return {
    isEditing,
    blogToEdit: selectedBlog,
    handleEdit,
    handleCloseEdit,
    handleSubmitEdit
  };
};