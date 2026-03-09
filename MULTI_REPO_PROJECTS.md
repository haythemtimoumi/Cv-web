# Multi-Repo Project Grouping Guide

## 🎯 Overview

Your portfolio now supports **intelligent project grouping** where multiple repositories can be displayed as a single project. This is perfect for full-stack applications with separate frontend, backend, and other components.

## 🏗️ How It Works

### Architecture Flow

```
1. Fetch ALL repos (public + private) using GitHub API
2. Filter repos with "portfolio" topic
3. Group repos by project-specific topics
4. Sort repos within each project (frontend first)
5. Display as unified project cards
```

## 📋 Setup Instructions

### Step 1: Update Your GitHub Token

Your token needs the **`repo`** scope to access private repositories.

**Create a new token:**
1. Go to: https://github.com/settings/tokens/new
2. Name: "Portfolio - Full Access"
3. Scopes needed:
   - ✅ **`repo`** (Full control of private repositories)
   - ✅ **`read:user`** (Read user profile data)
4. Generate and copy the token
5. Update `.env`:
   ```env
   REACT_APP_GITHUB_TOKEN=your_new_token_here
   ```

### Step 2: Tag Your Repositories

Add topics to your GitHub repositories to control how they appear in your portfolio.

#### For Standalone Projects

Add only the `portfolio` topic:

```
Topics: portfolio, react, nodejs
```

This repo will appear as a single project.

#### For Multi-Repo Projects

Add both `portfolio` AND a **project identifier** topic:

**Example: PFE Project (3 repos)**

**pfe-frontend:**
```
Topics: portfolio, pfe, react, frontend
```

**pfe-backend:**
```
Topics: portfolio, pfe, nodejs, backend
```

**pfe-scraper:**
```
Topics: portfolio, pfe, python, scraper
```

These 3 repos will be grouped as one "PFE" project!

**Example: Stock Dashboard (2 repos)**

**stock-dashboard-frontend:**
```
Topics: portfolio, stock-dashboard, react, frontend
```

**stock-dashboard-backend:**
```
Topics: portfolio, stock-dashboard, nodejs, backend
```

These 2 repos will be grouped as one "Stock Dashboard" project!

## 🎨 Project Naming

The project name is automatically generated from the project identifier:

- `pfe` → "Pfe"
- `stock-dashboard` → "Stock Dashboard"
- `e-commerce-app` → "E Commerce App"

## 📊 Repository Types

The system automatically detects repository types based on name and topics:

| Type | Detection | Badge Color |
|------|-----------|-------------|
| Frontend | Name/topic contains "frontend" | Blue |
| Backend | Name/topic contains "backend" | Green |
| API | Name/topic contains "api" | Cyan |
| Scraper | Name/topic contains "scraper" | Yellow |
| Mobile | Name/topic contains "mobile" | Gray |
| Admin | Name/topic contains "admin" | Dark |
| Main | Default for standalone repos | Blue |

## 🔄 Display Order

### Projects
- Sorted by total stars (sum of all repos in project)
- Most starred projects appear first

### Repositories within a Project
1. Frontend
2. Backend
3. API
4. Scraper
5. Mobile
6. Admin
7. Main

## 📝 Examples

### Example 1: Full-Stack E-Commerce

**Repositories:**
- `ecommerce-web` (React frontend)
- `ecommerce-api` (Node.js backend)
- `ecommerce-admin` (Admin panel)

**Topics to add:**
```
ecommerce-web: portfolio, ecommerce, react, frontend
ecommerce-api: portfolio, ecommerce, nodejs, backend, api
ecommerce-admin: portfolio, ecommerce, react, admin
```

**Result:** One project card titled "Ecommerce" with 3 expandable repositories.

### Example 2: Data Pipeline

**Repositories:**
- `data-scraper` (Python scraper)
- `data-processor` (Data processing)
- `data-dashboard` (Visualization)

**Topics to add:**
```
data-scraper: portfolio, data-pipeline, python, scraper
data-processor: portfolio, data-pipeline, python, backend
data-dashboard: portfolio, data-pipeline, react, frontend
```

**Result:** One project card titled "Data Pipeline" with 3 repositories.

### Example 3: Standalone Projects

**Repository:**
- `personal-blog`

**Topics to add:**
```
personal-blog: portfolio, nextjs, blog
```

**Result:** One project card for the blog (no grouping).

## 🎯 Best Practices

### 1. Consistent Naming
Use the same project identifier across all related repos:
- ✅ `pfe-frontend`, `pfe-backend`, `pfe-scraper`
- ❌ `pfe-frontend`, `project-backend`, `scraper`

### 2. Clear Topics
- Always include `portfolio` topic
- Add project identifier for multi-repo projects
- Add descriptive topics (react, nodejs, python, etc.)

### 3. Good Descriptions
- Write clear descriptions for each repository
- Main repo description will be used for the project card

### 4. Homepage URLs
- Add demo/live URLs to the main repository (usually frontend)
- This will show a "Live Demo" button

### 5. Star Your Best Work
- Star count determines project order
- Star your best projects to feature them first

## 🔍 Troubleshooting

### Issue: Private repos not showing

**Solution:**
- Verify your token has `repo` scope
- Check token is correctly set in `.env`
- Restart the development server

### Issue: Repos not grouping

**Solution:**
- Ensure all related repos have the same project identifier topic
- Check spelling of topics (case-sensitive)
- Verify all repos have the `portfolio` topic

### Issue: Wrong repository order

**Solution:**
- Add `frontend` or `backend` topics explicitly
- Rename repos to include type in name (e.g., `project-frontend`)

### Issue: Project not showing at all

**Solution:**
- Verify repo has `portfolio` topic
- Check if repo is archived (archived repos are included)
- Verify token has access to the repository

## 📊 Project Card Features

### Collapsed View (Default)
- Project name
- Main repository description
- Languages used across all repos
- Total stars
- Topics/tags
- GitHub and Demo buttons

### Expanded View (Click "Show all repositories")
- List of all repositories
- Repository type badges
- Individual repo descriptions
- Individual star counts
- Links to each repository

## 🚀 Advanced Configuration

### Change Portfolio Topic

Edit `.env`:
```env
REACT_APP_PORTFOLIO_TOPIC=showcase
```

Now use `showcase` instead of `portfolio` as the filter topic.

### Customize Repository Types

Edit `src/api/github.js` → `getRepoType()` function to add custom types.

### Customize Sorting

Edit `src/api/github.js` → `groupReposByProject()` function to change sort order.

## 📈 Statistics

The portfolio automatically calculates:
- Total number of projects
- Total number of repositories
- Total stars across all portfolio repos
- Unique languages used

## 🎉 Example Portfolio Structure

```
My Portfolio
├── PFE (3 repos, 15 stars)
│   ├── pfe-frontend (React)
│   ├── pfe-backend (Node.js)
│   └── pfe-scraper (Python)
├── Stock Dashboard (2 repos, 8 stars)
│   ├── stock-dashboard-frontend (React)
│   └── stock-dashboard-backend (Node.js)
├── Personal Blog (1 repo, 5 stars)
│   └── personal-blog (Next.js)
└── Weather App (1 repo, 3 stars)
    └── weather-app (React)
```

## 📚 Next Steps

1. **Tag your repositories** with appropriate topics
2. **Add descriptions** to all repos
3. **Set homepage URLs** for demos
4. **Star your best work** to feature it
5. **Test locally** to see the results
6. **Deploy** your portfolio

---

**Happy coding! 🚀**
