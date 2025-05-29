import React, { useState, useEffect } from 'react';
import App from './App';
import Game from './pages/Game';

const Router: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Create a context to provide navigation functionality
  const RouterContext = React.createContext({ navigate });

  // Custom hook to use the router
  const useRouter = () => React.useContext(RouterContext);

  // Export the hook for components to use
  (window as any).useRouter = useRouter;

  // Render the appropriate component based on the current path
  return (
    <RouterContext.Provider value={{ navigate }}>
      {currentPath === '/' && <App />}
      {currentPath === '/game' && <Game />}
    </RouterContext.Provider>
  );
};

export default Router;

// Custom hook to use the router
export const useRouter = () => {
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return { navigate };
};