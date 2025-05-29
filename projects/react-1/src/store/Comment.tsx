import { useState, useEffect, useCallback } from 'react';

type CommentStore = {
  [blogTitle: string]: string[];
};

type CommentStoreHook = {
  getCommentsByBlog: (blogTitle: string) => string[];
  addComment: (blogTitle: string, comment: string) => void;
  clearComments: (blogTitle: string) => void;
};

// Singleton pattern for the store
let listeners: (() => void)[] = [];
let store: CommentStore = {};

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const useCommentStore = (): CommentStoreHook => {
  const [, setRender] = useState({});

  useEffect(() => {
    // Subscribe to store changes
    const forceRender = () => setRender({});
    listeners.push(forceRender);
    
    return () => {
      // Unsubscribe from store changes
      listeners = listeners.filter(listener => listener !== forceRender);
    };
  }, []);

  const getCommentsByBlog = useCallback((blogTitle: string): string[] => {
    return store[blogTitle] || [];
  }, []);

  const addComment = useCallback((blogTitle: string, comment: string): void => {
    store = {
      ...store,
      [blogTitle]: [...(store[blogTitle] || []), comment]
    };
    notifyListeners();
  }, []);

  const clearComments = useCallback((blogTitle: string): void => {
    const newStore = { ...store };
    delete newStore[blogTitle];
    store = newStore;
    notifyListeners();
  }, []);

  return { getCommentsByBlog, addComment, clearComments };
};