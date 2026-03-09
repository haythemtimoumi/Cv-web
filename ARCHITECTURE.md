# Portfolio Architecture Documentation

## 🏗️ Architecture Overview

This portfolio uses a **dynamic data-driven architecture** that fetches information from the GitHub API instead of hardcoding personal information.

## 📊 Data Flow

```
.env (Environment Variables)
    ↓
config.js (Configuration Module)
    ↓
github.js (API Service Layer)
    ↓
Custom Hooks (useGitHubProfile, useGitHubRepos)
    ↓
React Components
    ↓
Dynamic UI Rendering
```

## 🔧 Core Components

### 1. Configuration Layer

**File:** `src/config/config.js`

Centralizes all environment variables:
- GitHub username
- GitHub token
- Social media links

**Benefits:**
- Single source of truth
- Easy to update
- Type-safe access

### 2. API Service Layer

**File:** `src/api/github.js`

Handles all GitHub API interactions:
- `fetchUserProfile()` - Get user profile data
- `fetchUserRepos()` - Get repositories (filtered & sorted)
- `fetchRepoDetails()` - Get specific repo details
- `fetchUserStats()` - Calculate statistics

**Features:**
- Authentication headers
- Error handling
- Automatic filtering (no forks, no private repos)
- Sorting by stars

### 3. Custom Hooks

**File:** `src/hooks/useGitHubProfile.js`

React hook for fetching user profile:
```javascript
const { profile, loading, error } = useGitHubProfile();
```

**Returns:**
- `profile` - User data (name, bio, location, etc.)
- `loading` - Loading state
- `error` - Error message if failed

**File:** `src/hooks/useGitHubRepos.js`

React hook for fetching repositories:
```javascript
const { repos, loading, error } = useGitHubRepos(limit);
```

**Returns:**
- `repos` - Array of repository objects
- `loading` - Loading state
- `error` - Error message if failed

### 4. Component Integration

#### Home Page (`src/components/Home/Home.js`)
- Fetches user profile for name
- Uses config for social links
- Displays loading state

#### About Page (`src/components/About/AboutCard.js`)
- Fetches user profile for bio
- Displays location, name
- Shows GitHub stats

#### Projects Page (`src/components/Projects/Projects.js`)
- Fetches all public repositories
- Filters out forks
- Sorts by stars
- Maps to ProjectCard components

#### Project Cards (`src/components/Projects/ProjectCards.js`)
- Displays repo name, description
- Shows language and star count
- Displays topics/tags
- Links to GitHub and demo

## 📦 Data Structure

### GitHub User Profile Response

```json
{
  "login": "haythemtimoumi",
  "name": "Haythem Timoumi",
  "avatar_url": "https://...",
  "bio": "Software developer...",
  "location": "Tunisia",
  "public_repos": 25,
  "followers": 50,
  "following": 30,
  "html_url": "https://github.com/haythemtimoumi"
}
```

### GitHub Repository Response

```json
{
  "name": "project-name",
  "description": "Project description",
  "html_url": "https://github.com/...",
  "homepage": "https://demo.com",
  "stargazers_count": 15,
  "language": "JavaScript",
  "fork": false,
  "private": false,
  "topics": ["react", "nodejs"]
}
```

## 🔄 Component Lifecycle

### 1. Component Mounts
```javascript
useEffect(() => {
  // Fetch data
}, []);
```

### 2. Loading State
```javascript
if (loading) return <Spinner />;
```

### 3. Error State
```javascript
if (error) return <ErrorMessage />;
```

### 4. Data Display
```javascript
return <Component data={profile} />;
```

## 🎯 Benefits of This Architecture

### ✅ Dynamic Content
- Portfolio auto-updates when you push new repos
- No need to manually update project list
- Always shows latest information

### ✅ Maintainable
- Change username in one place (.env)
- Centralized configuration
- Reusable API service

### ✅ Scalable
- Easy to add new API endpoints
- Can extend to other data sources
- Modular component structure

### ✅ Professional
- Industry-standard patterns
- Separation of concerns
- Clean code architecture

## 🔐 Security Considerations

### Token Protection
- Stored in `.env` (not committed to git)
- Only has read-only access
- Limited to public data

### API Rate Limits
- Without token: 60 requests/hour
- With token: 5,000 requests/hour

### Client-Side Limitations
- Token visible in browser (acceptable for public data)
- For production: consider backend proxy

## 🚀 Performance Optimizations

### Current Implementation
- Fetch on component mount
- No caching
- Fresh data on every page load

### Future Enhancements
1. **localStorage Caching**
   - Cache API responses
   - Set TTL (e.g., 1 hour)
   - Reduce API calls

2. **React Query Integration**
   - Better cache management
   - Automatic refetching
   - Optimistic updates

3. **Lazy Loading**
   - Load projects on scroll
   - Pagination for many repos

4. **Image Optimization**
   - Lazy load images
   - Use WebP format
   - Responsive images

## 📈 Monitoring & Analytics

### Recommended Additions

1. **Error Tracking**
   - Sentry integration
   - Log API failures
   - Track user issues

2. **Analytics**
   - Google Analytics
   - Track page views
   - Monitor user behavior

3. **Performance Monitoring**
   - Lighthouse scores
   - Core Web Vitals
   - API response times

## 🔧 Maintenance

### Regular Tasks

1. **Update Dependencies**
   ```bash
   npm update
   ```

2. **Rotate GitHub Token**
   - Generate new token every 90 days
   - Update .env file

3. **Review API Usage**
   - Check rate limit usage
   - Monitor API errors

4. **Update Content**
   - GitHub profile bio
   - Repository descriptions
   - Add topics to repos

## 📚 Additional Resources

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [Environment Variables in Create React App](https://create-react-app.dev/docs/adding-custom-environment-variables/)

## 🤝 Contributing

To contribute to this architecture:

1. Follow the existing patterns
2. Add new API methods to `github.js`
3. Create custom hooks for new data sources
4. Update components to use hooks
5. Document changes in this file

## 📝 Version History

- **v2.0** - Dynamic GitHub API integration
- **v1.0** - Static hardcoded content
