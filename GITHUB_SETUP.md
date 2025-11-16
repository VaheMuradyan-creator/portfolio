# GitHub Setup Guide

## Step 1: Install Git
1. Download from: https://git-scm.com/download/win
2. Install with default options
3. Restart your terminal/PowerShell

## Step 2: Initialize Git Repository

Open PowerShell in your project folder and run:

```powershell
# Initialize git repository
git init

# Add all files (except those in .gitignore)
git add .

# Create first commit
git commit -m "Initial commit: Portfolio website with contact form"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com
2. Sign in (or create account)
3. Click the **+** icon (top right) → **New repository**
4. Repository name: `portfolio` (or any name you want)
5. Description: "My portfolio website"
6. Choose **Public** or **Private**
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click **Create repository**

## Step 4: Connect and Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```powershell
# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 5: Verify

1. Go to your GitHub repository page
2. You should see all your files
3. Make sure `.env` and `dkim_*.key` files are **NOT** visible (they're in .gitignore)

## Important Security Notes

✅ **DO NOT commit:**
- `.env` file (contains passwords)
- `dkim_private.key` (your private key)
- `dkim_public.key` (not needed in repo)
- `node_modules/` (too large)

✅ **Safe to commit:**
- `server.js`
- `index.html`
- `script.js`
- `styles.css`
- `package.json`
- Documentation files (`.md` files)

## Future Updates

When you make changes:

```powershell
git add .
git commit -m "Description of changes"
git push
```

## Troubleshooting

### "Git is not recognized"
- Make sure Git is installed
- Restart your terminal after installation
- Check: `git --version`

### "Authentication failed"
- GitHub now requires a Personal Access Token instead of password
- Go to: GitHub → Settings → Developer settings → Personal access tokens → Generate new token
- Use the token as your password when pushing

### "Repository not found"
- Check the repository URL is correct
- Make sure the repository exists on GitHub
- Verify your GitHub username is correct

