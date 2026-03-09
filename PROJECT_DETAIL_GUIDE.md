# Project Detail Page - User Guide

## Overview
The portfolio now includes a detailed project page that displays screenshots from your README, videos, and full documentation from your GitHub repositories.

## Features

### 1. Enhanced Project Cards
- Each project card now has a "View Details" button
- Clicking it navigates to a dedicated project detail page

### 2. Project Detail Page
The detail page includes:

#### Header Section
- Project name and description
- Languages used
- Star count
- Number of repositories (for multi-repo projects)
- Technology tags/topics
- Quick links to GitHub and live demo

#### Screenshots Gallery
- **Automatically extracts images referenced in your README.md**
- Only shows images that are actually used in your documentation
- Click any image to view full size in a lightbox
- Hover effects with expand icon

#### Videos Section
- Automatically fetches video files from your repository
- Searches in common directories: `videos/`, `media/`, `assets/`, `demos/`
- Supported formats: MP4, WebM, MOV, AVI
- Embedded video player with controls

#### Documentation
- Displays the repository's README.md content
- Formatted markdown with syntax highlighting
- Images from README are displayed inline in the documentation
- Includes all sections from your README

#### Sidebar
- List of all repositories (for multi-repo projects)
- Repository types (frontend, backend, API, etc.)
- Star counts per repository
- Project statistics

## How to Add Media to Your Projects

### For Screenshots
**Important**: Screenshots are automatically extracted from your README.md file!

1. Add images to your repository (in any folder like `images/`, `screenshots/`, `assets/`, etc.)
2. Reference them in your README.md using markdown syntax:
   ```markdown
   ![Screenshot description](./images/screenshot.png)
   ```
   or
   ```markdown
   ![Screenshot description](https://raw.githubusercontent.com/username/repo/main/images/screenshot.png)
   ```
3. The system will automatically extract and display these images in the gallery

**Benefits of this approach:**
- Only shows relevant screenshots that you've documented
- No clutter from random images in your repo
- Images appear both in README and in the gallery
- Full control over what's displayed

### For Videos
1. Add video files to your repository root or in folders: `videos/`, `media/`, `assets/`, `demos/`
2. Supported formats: MP4, WebM, MOV, AVI
3. Videos will be automatically detected and displayed with a player

### For Documentation
- Your README.md is automatically displayed
- Use standard markdown formatting
- Images in README will be rendered inline
- Code blocks will have syntax highlighting

## URL Structure
- Projects list: `http://localhost:3000/project`
- Project detail: `http://localhost:3000/project/{project-id}`

Example: `http://localhost:3000/project/pfe`

## Tips
1. **Use descriptive alt text** for images in your README (the text in square brackets)
2. **Organize images** in dedicated folders for better repo structure
3. **Use relative paths** in README for portability (e.g., `./images/screenshot.png`)
4. **Keep video file sizes reasonable** for faster loading
5. **Write comprehensive README files** for better documentation
6. **Add topics/tags** to your repositories for better categorization

## Example README Structure

```markdown
# My Project

Description of your project...

## Screenshots

![Home Page](./screenshots/home.png)
![Dashboard](./screenshots/dashboard.png)
![Settings Page](./screenshots/settings.png)

## Features

- Feature 1
- Feature 2

## Installation

...
```

The screenshots section will automatically create a gallery with these three images!

## Navigation
- Click "View Details" on any project card to see the full page
- Use "Back to Projects" button to return to the projects list
- All external links (GitHub, Live Demo) open in new tabs
- Click any screenshot to view it full-screen
