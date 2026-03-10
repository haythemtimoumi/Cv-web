/**
 * Vercel Serverless Function - GitHub User Repositories
 * Proxies GitHub API calls to keep tokens secure
 */

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, page = 1, per_page = 100 } = req.query;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-App'
    };

    // Add token if available (for private repos and higher rate limits)
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      `https://api.github.com/user/repos?per_page=${per_page}&page=${page}&sort=updated&type=owner`,
      { headers }
    );

    if (!response.ok) {
      // Fallback to public repos if token fails
      if (response.status === 401 || response.status === 403) {
        const publicResponse = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=${per_page}&page=${page}&sort=updated&type=owner`,
          { 
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'Portfolio-App'
            }
          }
        );
        
        if (!publicResponse.ok) {
          throw new Error(`GitHub API error: ${publicResponse.status}`);
        }
        
        const data = await publicResponse.json();
        res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
        return res.status(200).json(data);
      }
      
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache for 30 minutes
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return res.status(500).json({ error: 'Failed to fetch repositories' });
  }
}