/**
 * Centralized configuration for the portfolio application
 * All environment variables are accessed through this module
 */

export const config = {
  github: {
    username: process.env.REACT_APP_GITHUB_USERNAME || 'haythemtimoumi',
    token: process.env.REACT_APP_GITHUB_TOKEN || '',
  },
  social: {
    linkedin: process.env.REACT_APP_LINKEDIN_URL || '',
    github: `https://github.com/${process.env.REACT_APP_GITHUB_USERNAME || 'haythemtimoumi'}`,
  },
  portfolio: {
    topic: process.env.REACT_APP_PORTFOLIO_TOPIC || 'portfolio',
  },
};

// Validate required environment variables
export const validateConfig = () => {
  const errors = [];
  
  if (!config.github.username) {
    errors.push('REACT_APP_GITHUB_USERNAME is not set');
  }
  
  if (!config.github.token) {
    console.warn('Warning: REACT_APP_GITHUB_TOKEN is not set. API rate limits will be restricted.');
  }
  
  if (errors.length > 0) {
    console.error('Configuration errors:', errors);
  }
  
  return errors.length === 0;
};
