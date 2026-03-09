# 🚀 Quick Start Guide

## ⚡ Get Your Portfolio Running in 5 Minutes

### Step 1: Open the `.env` file

The file is already created at the root of your project. Open it and you'll see:

```env
REACT_APP_GITHUB_USERNAME=haythemtimoumi
REACT_APP_GITHUB_TOKEN=YOUR_GITHUB_TOKEN_HERE
REACT_APP_LINKEDIN_URL=https://www.linkedin.com/in/haythem-timoumi-152b9b34a
```

### Step 2: Add Your GitHub Token

Replace `YOUR_GITHUB_TOKEN_HERE` with your actual token.

**You mentioned your token earlier. Add it to the `.env` file:**

```env
REACT_APP_GITHUB_TOKEN=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ok
```

⚠️ **IMPORTANT:** After testing, generate a NEW token and replace this one (since it was exposed publicly).

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start the Development Server

```bash
npm start
```

Your portfolio will open at: http://localhost:3000

## ✅ What to Expect

When you visit your portfolio, you should see:

### Home Page
- Your name: "HAYTHEM TIMOUMI"
- Typewriter animation with job titles
- Your GitHub and LinkedIn links

### About Page
- Your GitHub bio (if you have one)
- Tech stack icons
- Development tools
- GitHub contribution calendar

### Projects Page
- All your public GitHub repositories
- Sorted by stars
- Showing language, stars, and topics
- Links to GitHub and demos

## 🔧 Quick Customizations

### Change Job Titles

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

## 🐛 Common Issues

### Issue: Projects not loading?

**Check:**
1. Is your GitHub token correct in `.env`?
2. Does your token have `public_repo` and `read:user` scopes?
3. Check browser console for errors (F12)

### Issue: Name not showing?

**Check:**
1. Does your GitHub profile have a name set?
2. Is the API call succeeding? (Check Network tab in DevTools)

### Issue: Rate limit error?

**Solution:**
- Make sure your GitHub token is in the `.env` file
- Without token: 60 requests/hour
- With token: 5,000 requests/hour

## 📝 Next Steps

1. **Test everything works locally**
2. **Customize your tech stack and tools**
3. **Update your GitHub profile:**
   - Add a bio
   - Add descriptions to your repos
   - Add topics/tags to your repos
4. **Deploy to Vercel or Netlify**

## 🚀 Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables:
   - `REACT_APP_GITHUB_USERNAME` = `haythemtimoumi`
   - `REACT_APP_GITHUB_TOKEN` = `your_token`
   - `REACT_APP_LINKEDIN_URL` = `your_linkedin_url`
6. Click "Deploy"

Done! Your portfolio will be live in minutes.

## 📚 More Information

- **Full setup guide:** See `SETUP.md`
- **Architecture details:** See `ARCHITECTURE.md`
- **Complete summary:** See `IMPLEMENTATION_SUMMARY.md`

## 🎉 You're All Set!

Your portfolio is now:
- ✅ Dynamic (auto-updates from GitHub)
- ✅ Professional
- ✅ Easy to maintain
- ✅ Ready to deploy

**Enjoy your new portfolio! 🚀**
