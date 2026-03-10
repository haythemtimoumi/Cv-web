/**
 * Vercel Serverless Function - GitHub Repository README
 * Proxies GitHub API calls to keep tokens secure
 */

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { owner, repo } = req.query;
  
  if (!owner || !repo) {
    return res.status(400).json({ error: 'Owner and repo are required' });
  }

  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-App'
    };

    // Add token if available
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      { headers }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(200).json({ 
          content: "No README found for this repository.", 
          images: [] 
        });
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache for 1 hour
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching README:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch README',
      content: "Error loading README content.",
      images: []
    });
  }
}