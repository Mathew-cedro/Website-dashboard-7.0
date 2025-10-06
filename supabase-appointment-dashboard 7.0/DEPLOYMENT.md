# Deployment Guide

This guide will help you deploy your Appointment Dashboard to various hosting platforms.

## Prerequisites

Before deploying, you need:
1. A Gemini API key from Google AI Studio
2. The Supabase database is already configured in the code

## Environment Variables

Your deployment platform needs this environment variable:

- `VITE_API_KEY` - Your Gemini API key (get it from https://aistudio.google.com/app/apikey)

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy from the project directory:
   ```bash
   vercel
   ```

3. Follow the prompts and when asked, add your environment variable:
   - Variable name: `VITE_API_KEY`
   - Value: Your Gemini API key

4. Your app will be live at the provided URL!

**Or use Vercel Dashboard:**
1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Import your repository
5. Add environment variable `VITE_API_KEY` with your Gemini API key
6. Click "Deploy"

### Option 2: Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

3. Add environment variable in Netlify Dashboard:
   - Go to Site settings > Environment variables
   - Add `VITE_API_KEY` with your Gemini API key
   - Redeploy the site

**Or use Netlify Dashboard:**
1. Go to https://netlify.com
2. Drag and drop your `dist` folder
3. Go to Site settings > Environment variables
4. Add `VITE_API_KEY` with your Gemini API key
5. Trigger a redeploy

### Option 3: GitHub Pages with GitHub Actions

1. Create `.github/workflows/deploy.yml` in your repository
2. Add your `VITE_API_KEY` as a GitHub Secret:
   - Go to your repo Settings > Secrets and variables > Actions
   - Add a new secret named `VITE_API_KEY`
3. Push to the main branch and GitHub Actions will automatically deploy

### Option 4: Cloudflare Pages

1. Go to https://pages.cloudflare.com
2. Connect your Git repository
3. Set build command: `npm run build`
4. Set build output directory: `dist`
5. Add environment variable `VITE_API_KEY` with your Gemini API key
6. Save and deploy

## Quick Deploy with Vercel (Fastest Method)

Run this single command:
```bash
npx vercel --prod
```

Then set the environment variable in the Vercel dashboard.

## After Deployment

Once deployed, your app will be live and ready to use! The dashboard will:
- Connect to your Supabase database automatically
- Display appointment data in real-time
- Generate AI insights using Gemini
- Support dark/light themes
- Show interactive charts and statistics

## Troubleshooting

**If you see "API Key Missing" warning:**
- Make sure you've added the `VITE_API_KEY` environment variable
- Redeploy after adding environment variables

**If charts aren't loading:**
- Check browser console for errors
- Verify Supabase credentials are correct
- Ensure the database has appointment data

## Support

For issues, check:
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- The README.md file in this project
