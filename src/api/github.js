/**
 * Advanced GitHub API Service
 * Uses Vercel serverless functions to keep tokens secure
 */

import { config } from '../config/config';

// Use relative URLs for Vercel serverless functions
const API_BASE = '/api';

/**
 * Fetch GitHub user profile via serverless function
 * @returns {Promise<Object>} User profile data
 */
export const fetchUserProfile = async () => {
  try {
    const response = await fetch(
      `${API_BASE}/github-profile?username=${config.github.username}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Fetch user repositories via serverless function
 * @returns {Promise<Array>} Array of all repository objects
 */
export const fetchAllUserRepos = async () => {
  try {
    let allRepos = [];
    let page = 1;
    const perPage = 100;
    
    // Fetch all pages of repositories
    while (true) {
      const response = await fetch(
        `${API_BASE}/github-repos?username=${config.github.username}&per_page=${perPage}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const repos = await response.json();
      
      if (repos.length === 0) break;
      
      allRepos = allRepos.concat(repos);
      
      if (repos.length < perPage) break;
      
      page++;
    }
    
    return allRepos;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
};

/**
 * Filter repositories by portfolio topic
 * @param {Array} repos - Array of repository objects
 * @returns {Array} Filtered repositories with 'portfolio' topic
 */
export const filterPortfolioRepos = (repos) => {
  const portfolioTopic = config.portfolio.topic;
  
  return repos.filter(repo => {
    // Check if repo has the portfolio topic
    return repo.topics && repo.topics.includes(portfolioTopic);
  });
};

/**
 * Extract project identifier from repository topics
 * Looks for topics that could be project names (e.g., 'pfe', 'stock-dashboard')
 * @param {Object} repo - Repository object
 * @returns {string|null} Project identifier or null
 */
const extractProjectId = (repo) => {
  if (!repo.topics || repo.topics.length === 0) return null;
  
  const portfolioTopic = config.portfolio.topic;
  
  // Find topics that aren't 'portfolio' and could be project identifiers
  const projectTopics = repo.topics.filter(topic => 
    topic !== portfolioTopic && 
    !['frontend', 'backend', 'api', 'scraper', 'mobile', 'web'].includes(topic)
  );
  
  // Return the first project-specific topic
  return projectTopics.length > 0 ? projectTopics[0] : null;
};

/**
 * Determine repository type (frontend, backend, etc.)
 * @param {Object} repo - Repository object
 * @returns {string} Repository type
 */
const getRepoType = (repo) => {
  const name = repo.name.toLowerCase();
  const topics = repo.topics || [];
  const description = (repo.description || '').toLowerCase();
  
  // Check topics first (most explicit)
  if (topics.includes('frontend')) return 'frontend';
  if (topics.includes('backend')) return 'backend';
  if (topics.includes('api')) return 'api';
  if (topics.includes('scraper')) return 'scraper';
  if (topics.includes('mobile')) return 'mobile';
  if (topics.includes('admin')) return 'admin';
  
  // Check name patterns
  if (name.includes('frontend') || name.includes('client') || name.includes('dashboard') || name.includes('web')) return 'frontend';
  if (name.includes('backend') || name.includes('server')) return 'backend';
  if (name.includes('api')) return 'api';
  if (name.includes('scraper')) return 'scraper';
  if (name.includes('mobile') || name.includes('app')) return 'mobile';
  if (name.includes('admin')) return 'admin';
  
  // Check description
  if (description.includes('frontend') || description.includes('dashboard') || description.includes('ui')) return 'frontend';
  if (description.includes('backend') || description.includes('server')) return 'backend';
  if (description.includes('api')) return 'api';
  
  return 'main';
};

/**
 * Group repositories by project
 * Multi-repo projects are grouped together based on shared topics
 * @param {Array} repos - Array of repository objects
 * @returns {Array} Array of project objects with grouped repos
 */
export const groupReposByProject = (repos) => {
  const projectMap = new Map();
  const standaloneRepos = [];
  
  repos.forEach(repo => {
    const projectId = extractProjectId(repo);
    
    if (projectId) {
      // This repo belongs to a multi-repo project
      if (!projectMap.has(projectId)) {
        projectMap.set(projectId, {
          id: projectId,
          name: projectId.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          repos: [],
          isMultiRepo: true,
        });
      }
      
      projectMap.get(projectId).repos.push({
        ...repo,
        type: getRepoType(repo),
      });
    } else {
      // Standalone repository
      standaloneRepos.push({
        id: repo.name,
        name: repo.name.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        repos: [{
          ...repo,
          type: 'main',
        }],
        isMultiRepo: false,
      });
    }
  });
  
  // Convert map to array and combine with standalone repos
  const groupedProjects = Array.from(projectMap.values());
  
  // Sort repos within each project (frontend/main first, then backend, then api, etc.)
  const typeOrder = { frontend: 1, main: 2, backend: 3, api: 4, scraper: 5, mobile: 6, admin: 7 };
  
  groupedProjects.forEach(project => {
    project.repos.sort((a, b) => {
      return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
    });
  });
  
  // Combine and sort by stars (sum of all repos in project)
  const allProjects = [...groupedProjects, ...standaloneRepos];
  
  allProjects.forEach(project => {
    project.totalStars = project.repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    // First repo after sorting (frontend or main, not api)
    project.mainRepo = project.repos[0];
  });
  
  // Sort by total stars
  allProjects.sort((a, b) => b.totalStars - a.totalStars);
  
  return allProjects;
};

/**
 * Fetch and process portfolio projects
 * Main function that combines all steps:
 * 1. Fetch all repos (public + private)
 * 2. Filter by 'portfolio' topic
 * 3. Group multi-repo projects
 * 4. Sort and return
 * @returns {Promise<Array>} Array of project objects
 */
export const fetchPortfolioProjects = async () => {
  try {
    // Step 1: Fetch all repositories
    const allRepos = await fetchAllUserRepos();
    
    // Step 2: Filter by portfolio topic
    const portfolioRepos = filterPortfolioRepos(allRepos);
    
    // Step 3: Group by project
    const projects = groupReposByProject(portfolioRepos);
    
    console.log(`Found ${allRepos.length} total repos, ${portfolioRepos.length} portfolio repos, ${projects.length} projects`);
    
    return projects;
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    throw error;
  }
};

/**
 * Fetch user's GitHub statistics
 * @returns {Promise<Object>} User statistics
 */
export const fetchUserStats = async () => {
  try {
    const profile = await fetchUserProfile();
    const projects = await fetchPortfolioProjects();
    
    // Calculate total stars across all portfolio repos
    const totalStars = projects.reduce((sum, project) => sum + project.totalStars, 0);
    
    // Get all unique languages
    const languages = new Set();
    projects.forEach(project => {
      project.repos.forEach(repo => {
        if (repo.language) languages.add(repo.language);
      });
    });
    
    return {
      totalRepos: profile.public_repos,
      portfolioProjects: projects.length,
      totalStars,
      followers: profile.followers,
      following: profile.following,
      languages: Array.from(languages),
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

/**
 * Fetch repository README content via serverless function
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} branch - Branch name (optional, will be detected from README response)
 * @returns {Promise<Object>} Object with content and images array
 */
export const fetchRepoReadme = async (owner, repo, branch = null) => {
  try {
    const response = await fetch(
      `${API_BASE}/github-readme?owner=${owner}&repo=${repo}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      return { content: data.content || "Error loading README content.", images: [] };
    }
    
    // Decode base64 content with proper UTF-8 handling
    const content = decodeURIComponent(escape(atob(data.content)));
    
    // Get branch from README URL if not provided
    if (!branch) {
      // Extract branch from the download_url or html_url
      const urlMatch = data.download_url?.match(/\/([^/]+)\/README\.md$/i);
      branch = urlMatch ? urlMatch[1] : 'main';
    }
    
    // Extract image URLs from markdown
    const images = extractImagesFromMarkdown(content, owner, repo, branch);
    
    return { content, images, branch };
  } catch (error) {
    console.error('Error fetching README:', error);
    return { content: "Error loading README content.", images: [], branch: 'main' };
  }
};

/**
 * Extract image URLs from markdown content
 * @param {string} markdown - Markdown content
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} branch - Branch name (default: main)
 * @returns {Array} Array of image objects with url and name
 */
const extractImagesFromMarkdown = (markdown, owner, repo, branch = 'main') => {
  const images = [];
  
  // Regex patterns for markdown images
  // ![alt](url) or <img src="url">
  const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["']/g;
  
  // Extract markdown style images
  let match;
  while ((match = markdownImageRegex.exec(markdown)) !== null) {
    const alt = match[1] || 'Screenshot';
    let url = match[2];
    
    // Convert relative URLs to absolute GitHub URLs
    if (!url.startsWith('http')) {
      // Remove leading ./ or /
      url = url.replace(/^\.?\//, '');
      
      // For private repos, use API endpoint; for public, use raw.githubusercontent.com
      // We'll use the API endpoint which works for both
      const apiUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${url}?ref=${branch}`;
      
      images.push({
        name: alt,
        download_url: apiUrl,
        html_url: url,
        isApiUrl: true,
        path: url
      });
    } else {
      images.push({
        name: alt,
        download_url: url,
        html_url: url,
        isApiUrl: false
      });
    }
  }
  
  // Extract HTML style images
  while ((match = htmlImageRegex.exec(markdown)) !== null) {
    let url = match[1];
    
    // Convert relative URLs to absolute GitHub URLs
    if (!url.startsWith('http')) {
      url = url.replace(/^\.?\//, '');
      const apiUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${url}?ref=${branch}`;
      
      // Avoid duplicates
      if (!images.some(img => img.path === url)) {
        images.push({
          name: 'Screenshot',
          download_url: apiUrl,
          html_url: url,
          isApiUrl: true,
          path: url
        });
      }
    } else {
      // Avoid duplicates
      if (!images.some(img => img.download_url === url)) {
        images.push({
          name: 'Screenshot',
          download_url: url,
          html_url: url,
          isApiUrl: false
        });
      }
    }
  }
  
  return images;
};

/**
 * Fetch repository contents and extract video files only
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - Path within repository (default: root)
 * @returns {Promise<Array>} Array of video file objects
 */
export const fetchRepoVideos = async (owner, repo, path = '') => {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      { headers: getHeaders() }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const contents = await response.json();
    const videos = [];
    
    // Video extensions
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
    
    // Common video directories to check
    const videoDirectories = ['videos', 'media', 'assets', 'demos'];
    
    for (const item of contents) {
      const lowerName = item.name.toLowerCase();
      
      // Check if it's a video
      if (item.type === 'file' && videoExtensions.some(ext => lowerName.endsWith(ext))) {
        videos.push(item);
      }
      
      // Recursively check video directories (limit depth to avoid too many requests)
      if (item.type === 'dir' && videoDirectories.includes(lowerName) && !path) {
        try {
          const subVideos = await fetchRepoVideos(owner, repo, item.path);
          videos.push(...subVideos);
        } catch (error) {
          console.error(`Error fetching contents from ${item.path}:`, error);
        }
      }
    }
    
    return videos;
  } catch (error) {
    console.error('Error fetching repository videos:', error);
    return [];
  }
};


/**
 * Fetch image from GitHub API and convert to data URL
 * @param {string} apiUrl - GitHub API URL for the file
 * @returns {Promise<string>} Data URL of the image
 */
export const fetchImageAsDataUrl = async (apiUrl) => {
  try {
    const response = await fetch(apiUrl, { headers: getHeaders() });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const data = await response.json();
    
    // GitHub API returns base64 encoded content
    if (data.content && data.encoding === 'base64') {
      // Determine mime type from file extension
      const extension = data.name.split('.').pop().toLowerCase();
      const mimeTypes = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'webp': 'image/webp'
      };
      const mimeType = mimeTypes[extension] || 'image/png';
      
      // Remove newlines from base64 string
      const base64Content = data.content.replace(/\n/g, '');
      
      return `data:${mimeType};base64,${base64Content}`;
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
};
