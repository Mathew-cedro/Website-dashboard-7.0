# Quick Deploy Instructions

Your app is ready to deploy! Here are the fastest ways to get it online:

## Method 1: Vercel (Recommended - 2 minutes)

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New" > "Project"
3. Click "Import" from the list or upload this folder
4. Vercel will auto-detect it's a Vite project
5. Before deploying, click "Environment Variables" and add:
   - Name: `VITE_API_KEY`
   - Value: Your Gemini API key (get from https://aistudio.google.com/app/apikey)
6. Click "Deploy"
7. Done! Your app will be live in ~1 minute

## Method 2: Netlify (3 minutes)

### Option A: Drag & Drop (Easiest)
1. Go to https://app.netlify.com/drop
2. Drag the `dist` folder from this project
3. Your site is live!
4. To add the API key:
   - Go to Site settings > Environment variables
   - Add `VITE_API_KEY` with your Gemini API key
   - Go to Deploys > Trigger deploy

### Option B: GitHub Integration
1. Push this code to GitHub
2. Go to https://netlify.com and sign in
3. Click "Add new site" > "Import from Git"
4. Select your repository
5. Build settings are auto-detected
6. Add environment variable `VITE_API_KEY`
7. Click "Deploy"

## Method 3: Cloudflare Pages (3 minutes)

1. Go to https://dash.cloudflare.com
2. Select "Workers & Pages" > "Create application" > "Pages"
3. Connect your Git repository or upload directly
4. Build command: `npm run build`
5. Build output: `dist`
6. Add environment variable: `VITE_API_KEY`
7. Deploy!

## What You Need

Just one thing: **Your Gemini API Key**

Get it here: https://aistudio.google.com/app/apikey

## Files Included

✅ `dist/` - Production build ready to serve
✅ `vercel.json` - Vercel configuration
✅ `netlify.toml` - Netlify configuration
✅ Configuration for SPA routing
✅ All dependencies listed in package.json

## Your App URL

After deployment, you'll get a URL like:
- Vercel: `your-app.vercel.app`
- Netlify: `your-app.netlify.app`
- Cloudflare: `your-app.pages.dev`

You can also add a custom domain later!

## Next Steps After Deployment

1. Visit your live URL
2. The dashboard will connect to Supabase automatically
3. View your appointment data with beautiful charts
4. Try the dark/light mode toggle in Settings
5. Share the URL with your team!

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Cloudflare Docs: https://developers.cloudflare.com/pages

---

**Note:** The Supabase database credentials are already configured in the code, so your app will work immediately after adding the Gemini API key!
