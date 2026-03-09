# Portfolio Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your information:

```env
REACT_APP_GITHUB_USERNAME=haythemtimoumi
REACT_APP_GITHUB_TOKEN=your_github_token_here
REACT_APP_LINKEDIN_URL=https://www.linkedin.com/in/haythem-timoumi-152b9b34a
```

### 3. Get Your GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens/new
2. Give it a name: "Portfolio Website"
3. Set expiration: "No expiration" or "90 days"
4. Select scopes:
   - ✅ `public_repo` (read public repositories)
   - ✅ `read:user` (read user profile)
5. Click "Generate token"
6. Copy the token (starts with `ghp_...`)
7. Paste it in your `.env` file as `REACT_APP_GITHUB_TOKEN`

⚠️ **IMPORTANT:** Never commit your `.env` file to git! It's already in `.gitignore`.

### 4. Run the Development Server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view your portfolio.

## 📁 Project Structure

```
src/
├── api/
│   └── github.js          # GitHub API service
├── config/
│   └── config.js          # Environment configuration
├── hooks/
│   ├── useGitHubProfile.js  # Hook for user profile
│   └── useGitHubRepos.js    # Hook for repositories
├── components/
│   ├── Home/              # Landing page
│   ├── About/             # About section
│   ├── Projects/          # Projects (dynamic from GitHub)
│   └── Resume/            # Resume viewer
```

## 🎨 Customization

### Update Personal Information

All personal data is now loaded dynamically from GitHub API:
- **Name:** Fetched from GitHub profile
- **Bio:** Fetched from GitHub profile
- **Location:** Fetched from GitHub profile
- **Projects:** Fetched from your public repositories

### Update Social Links

Edit `.env` file:
```env
REACT_APP_LINKEDIN_URL=your_linkedin_url
```

### Update Job Titles (Typewriter Effect)

Edit `src/components/Home/Type.js`:
```javascript
strings: [
  "Software Developer",
  "Full Stack Developer",
  "Automation Engineer",
  "AI Tools Builder",
]
```

### Update Tech Stack

Edit `src/components/About/Techstack.js` to add/remove technologies.

### Update Tools

Edit `src/components/About/Toolstack.js` to add/remove development tools.

## 🔧 How It Works

### Dynamic Data Loading

1. **GitHub Profile:** Fetched from `https://api.github.com/users/{username}`
2. **Repositories:** Fetched from `https://api.github.com/users/{username}/repos`
3. **Filtering:** Automatically excludes forks and private repos
4. **Sorting:** Sorted by stars (most starred first)

### API Rate Limits

- **Without token:** 60 requests/hour
- **With token:** 5,000 requests/hour

### Caching

Currently, data is fetched on each page load. For production, consider:
- Adding localStorage caching
- Implementing a refresh interval
- Using React Query for better data management

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `REACT_APP_GITHUB_USERNAME`
   - `REACT_APP_GITHUB_TOKEN`
   - `REACT_APP_LINKEDIN_URL`
5. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import your repository
4. Add environment variables in Netlify dashboard
5. Deploy!

## 🔒 Security Notes

- ✅ `.env` is in `.gitignore` (never committed)
- ✅ Token only has read-only access to public data
- ✅ Token is safe to use in client-side (for public data only)
- ⚠️ For production, consider using a backend proxy to hide the token

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio!

## 📧 Support

If you have questions or need help, please open an issue on GitHub.
