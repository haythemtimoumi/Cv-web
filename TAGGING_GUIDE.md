# 🏷️ Quick Tagging Guide for Your Repositories

## ⚡ TL;DR

Add topics to your GitHub repos to control how they appear in your portfolio.

## 📋 Tagging Rules

### Rule 1: All Portfolio Repos Need `portfolio` Topic

```
✅ Topics: portfolio, react, nodejs
❌ Topics: react, nodejs (missing 'portfolio')
```

### Rule 2: Multi-Repo Projects Need a Shared Identifier

**Example: PFE Project**
```
pfe-frontend:  portfolio, pfe, react, frontend
pfe-backend:   portfolio, pfe, nodejs, backend
pfe-scraper:   portfolio, pfe, python, scraper
```

All three repos share the `pfe` topic → They group together!

### Rule 3: Standalone Projects Only Need `portfolio`

```
personal-blog: portfolio, nextjs, blog
```

No shared identifier → Displays as single project.

## 🎯 How to Add Topics to Your Repos

### Method 1: GitHub Web Interface

1. Go to your repository on GitHub
2. Click the ⚙️ gear icon next to "About"
3. Add topics in the "Topics" field
4. Click "Save changes"

### Method 2: Repository Settings

1. Go to repository → Settings
2. Scroll to "Topics"
3. Add your topics
4. Save

## 📊 Common Patterns

### Pattern 1: Full-Stack App (Frontend + Backend)

```
myapp-frontend:
  Topics: portfolio, myapp, react, frontend

myapp-backend:
  Topics: portfolio, myapp, nodejs, backend
```

**Result:** One "Myapp" project with 2 repos

### Pattern 2: Microservices Architecture

```
shop-web:      portfolio, shop, react, frontend
shop-api:      portfolio, shop, nodejs, api
shop-auth:     portfolio, shop, nodejs, backend
shop-payment:  portfolio, shop, nodejs, backend
```

**Result:** One "Shop" project with 4 repos

### Pattern 3: Data Pipeline

```
scraper:    portfolio, pipeline, python, scraper
processor:  portfolio, pipeline, python, backend
dashboard:  portfolio, pipeline, react, frontend
```

**Result:** One "Pipeline" project with 3 repos

### Pattern 4: Mobile + Web

```
app-mobile:  portfolio, myapp, react-native, mobile
app-web:     portfolio, myapp, react, frontend
app-api:     portfolio, myapp, nodejs, backend
```

**Result:** One "Myapp" project with 3 repos

## 🎨 Recommended Topics

### Technology Topics
```
Languages: javascript, typescript, python, java, go, rust
Frontend: react, vue, angular, nextjs, svelte
Backend: nodejs, express, django, flask, spring
Mobile: react-native, flutter, swift, kotlin
Database: mongodb, postgresql, mysql, redis
Cloud: aws, azure, gcp, docker, kubernetes
```

### Type Topics (for multi-repo projects)
```
frontend, backend, api, scraper, mobile, admin
```

### Project Topics
```
Your project identifier: pfe, stock-dashboard, ecommerce, etc.
```

## ✅ Checklist for Each Repo

- [ ] Has `portfolio` topic
- [ ] Has project identifier (if part of multi-repo project)
- [ ] Has type topic (frontend/backend/etc.)
- [ ] Has technology topics (react, nodejs, etc.)
- [ ] Has good description
- [ ] Has homepage URL (if applicable)

## 🚀 Quick Start

### Step 1: Identify Your Projects

List all repos that should appear in your portfolio:
```
✓ pfe-frontend
✓ pfe-backend
✓ pfe-scraper
✓ personal-blog
✓ weather-app
```

### Step 2: Decide Grouping

Which repos belong together?
```
Group 1 (PFE): pfe-frontend, pfe-backend, pfe-scraper
Standalone: personal-blog
Standalone: weather-app
```

### Step 3: Add Topics

**PFE repos:**
```
pfe-frontend:  portfolio, pfe, react, frontend
pfe-backend:   portfolio, pfe, nodejs, backend
pfe-scraper:   portfolio, pfe, python, scraper
```

**Standalone repos:**
```
personal-blog: portfolio, nextjs, blog
weather-app:   portfolio, react, api
```

### Step 4: Test

```bash
npm start
```

Visit http://localhost:3000/project and verify your projects appear correctly!

## 🔍 Examples from Your Repos

Based on your GitHub username `haythemtimoumi`, here are some examples:

### If you have a PFE project:

```
Repository: pfe-frontend
Topics: portfolio, pfe, react, typescript, frontend

Repository: pfe-backend
Topics: portfolio, pfe, nodejs, express, backend

Repository: pfe-scraper
Topics: portfolio, pfe, python, scraper
```

### If you have a stock dashboard:

```
Repository: stock-dashboard-frontend
Topics: portfolio, stock-dashboard, react, charts, frontend

Repository: stock-dashboard-backend
Topics: portfolio, stock-dashboard, nodejs, api, backend
```

### If you have standalone projects:

```
Repository: portfolio-website
Topics: portfolio, react, personal

Repository: automation-tool
Topics: portfolio, python, automation

Repository: api-wrapper
Topics: portfolio, nodejs, api
```

## 💡 Pro Tips

1. **Use lowercase** for project identifiers: `pfe` not `PFE`
2. **Use hyphens** for multi-word identifiers: `stock-dashboard` not `stock_dashboard`
3. **Be consistent** across all related repos
4. **Add descriptions** to all repos (used in project cards)
5. **Set homepage URLs** for live demos

## 🐛 Common Mistakes

### ❌ Mistake 1: Inconsistent Identifiers
```
pfe-frontend:  portfolio, pfe, react
pfe-backend:   portfolio, project-pfe, nodejs  ← Wrong!
```

### ❌ Mistake 2: Missing Portfolio Topic
```
pfe-frontend:  pfe, react  ← Missing 'portfolio'!
```

### ❌ Mistake 3: Typos
```
pfe-frontend:  portfolio, pfe, react
pfe-backend:   portfolio, pef, nodejs  ← Typo: 'pef' instead of 'pfe'!
```

### ✅ Correct:
```
pfe-frontend:  portfolio, pfe, react, frontend
pfe-backend:   portfolio, pfe, nodejs, backend
pfe-scraper:   portfolio, pfe, python, scraper
```

## 📞 Need Help?

If your projects aren't grouping correctly:

1. Check all repos have `portfolio` topic
2. Verify project identifier is spelled the same across all repos
3. Check topics are lowercase
4. Restart the development server
5. Check browser console for errors

---

**Ready to tag your repos? Let's go! 🚀**
