/**
 * Diagnostic utilities to check GitHub API access
 */

import { config } from '../config/config';

/**
 * Check GitHub token scopes
 * @returns {Promise<Object>} Token information and scopes
 */
export const checkTokenScopes = async () => {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${config.github.token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    // Get scopes from response headers
    const scopes = response.headers.get('X-OAuth-Scopes');
    const rateLimit = response.headers.get('X-RateLimit-Remaining');
    const rateLimitTotal = response.headers.get('X-RateLimit-Limit');

    const user = await response.json();

    return {
      success: true,
      user: user.login,
      scopes: scopes ? scopes.split(', ') : [],
      hasRepoScope: scopes ? scopes.includes('repo') : false,
      hasPublicRepoScope: scopes ? scopes.includes('public_repo') : false,
      rateLimit: {
        remaining: rateLimit,
        total: rateLimitTotal,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Test fetching private repositories
 * @returns {Promise<Object>} Test results
 */
export const testPrivateRepoAccess = async () => {
  try {
    const response = await fetch('https://api.github.com/user/repos?per_page=5&affiliation=owner', {
      headers: {
        'Authorization': `token ${config.github.token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const repos = await response.json();
    const privateRepos = repos.filter(r => r.private);
    const publicRepos = repos.filter(r => !r.private);

    return {
      success: true,
      totalRepos: repos.length,
      privateRepos: privateRepos.length,
      publicRepos: publicRepos.length,
      canAccessPrivate: privateRepos.length > 0 || repos.length === 0,
      sampleRepos: repos.slice(0, 3).map(r => ({
        name: r.name,
        private: r.private,
        topics: r.topics,
      })),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Run full diagnostics
 * @returns {Promise<Object>} Complete diagnostic report
 */
export const runDiagnostics = async () => {
  console.log('🔍 Running GitHub API Diagnostics...\n');

  const tokenCheck = await checkTokenScopes();
  console.log('Token Check:', tokenCheck);

  const repoAccess = await testPrivateRepoAccess();
  console.log('Repo Access Test:', repoAccess);

  const report = {
    timestamp: new Date().toISOString(),
    token: {
      configured: !!config.github.token,
      valid: tokenCheck.success,
      scopes: tokenCheck.scopes || [],
      hasRepoScope: tokenCheck.hasRepoScope || false,
      hasPublicRepoScope: tokenCheck.hasPublicRepoScope || false,
    },
    access: {
      canFetchRepos: repoAccess.success,
      canAccessPrivate: repoAccess.canAccessPrivate || false,
      totalRepos: repoAccess.totalRepos || 0,
      privateRepos: repoAccess.privateRepos || 0,
      publicRepos: repoAccess.publicRepos || 0,
    },
    recommendations: [],
  };

  // Generate recommendations
  if (!config.github.token) {
    report.recommendations.push('❌ No GitHub token configured. Add REACT_APP_GITHUB_TOKEN to .env');
  } else if (!tokenCheck.success) {
    report.recommendations.push('❌ Token is invalid or expired. Generate a new token.');
  } else if (!tokenCheck.hasRepoScope) {
    report.recommendations.push('⚠️ Token does not have "repo" scope. Private repositories will not be accessible.');
    report.recommendations.push('👉 Generate a new token with "repo" scope at: https://github.com/settings/tokens/new');
  } else if (repoAccess.privateRepos === 0 && repoAccess.totalRepos > 0) {
    report.recommendations.push('✅ Token has correct scopes, but no private repos found.');
    report.recommendations.push('💡 Make sure your private repos have the "portfolio" topic.');
  } else if (repoAccess.privateRepos > 0) {
    report.recommendations.push('✅ Everything looks good! Private repos are accessible.');
  }

  console.log('\n📊 Diagnostic Report:', report);
  return report;
};
