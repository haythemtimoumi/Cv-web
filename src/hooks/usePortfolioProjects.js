import { useState, useEffect } from 'react';
import { fetchPortfolioProjects } from '../api/github';

/**
 * Custom hook to fetch and manage portfolio projects
 * Handles multi-repo projects grouped by topics
 * @returns {Object} { projects, loading, error }
 */
export const usePortfolioProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchPortfolioProjects();
        
        if (isMounted) {
          setProjects(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error('Failed to load portfolio projects:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []);

  return { projects, loading, error };
};
