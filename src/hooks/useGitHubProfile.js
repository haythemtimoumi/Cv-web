import { useState, useEffect } from 'react';
import { fetchUserProfile } from '../api/github';

/**
 * Custom hook to fetch and manage GitHub user profile data
 * @returns {Object} { profile, loading, error }
 */
export const useGitHubProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchUserProfile();
        
        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error('Failed to load GitHub profile:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []);

  return { profile, loading, error };
};
