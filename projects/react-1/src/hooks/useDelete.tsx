import { useCallback } from 'react';
import { useBlogContext } from '../context/BlogContext';

export const useDelete = () => {
  const { deleteBlog } = useBlogContext();

  const handleDelete = useCallback(() => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      deleteBlog();
    }
  }, [deleteBlog]);

  return { handleDelete };
};