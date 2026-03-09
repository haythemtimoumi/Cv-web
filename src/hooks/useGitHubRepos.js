import { useState, useEffect } from 'react';
import { fetchAllUserRepos } from '../api/github';

/**
 * Custom hook to fetch and manage ALL GitHub repositories (public + private)
 * @param {number} limit - Maximum number of repos to return (optional)
 * @returns {Object} { repos, loading, error }
 */
export const useGitHubRepos = (limit = null) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadRepos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchAllUserRepos();
        
        if (isMounted) {
          // Apply limit if specified
          const limitedRepos = limit ? data.slice(0, limit) : data;
          setRepos(limitedRepos);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error('Failed to load GitHub repositories:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRepos();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { repos, loading, error };
};
