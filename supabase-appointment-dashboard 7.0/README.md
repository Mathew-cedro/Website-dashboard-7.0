<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Appointment Dashboard

A modern, real-time appointment management dashboard with AI-powered insights.

## Features

- Real-time appointment tracking with Supabase
- AI-powered insights using Google Gemini
- Interactive charts and visualizations
- Dark/Light theme support
- Browser notifications for appointment updates
- Responsive design for all devices

## Quick Deploy

See [QUICK-DEPLOY.md](QUICK-DEPLOY.md) for the fastest way to publish your app online (2 minutes).

**One-click deploy options:**
- [Deploy to Vercel](https://vercel.com/new) - Recommended
- [Deploy to Netlify](https://app.netlify.com/drop) - Drag & drop the `dist` folder
- [Deploy to Cloudflare Pages](https://pages.cloudflare.com)

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file and add your Gemini API key:
   ```
   VITE_API_KEY=your_gemini_api_key_here
   ```
   Get your API key from: https://aistudio.google.com/app/apikey

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

Your app requires one environment variable:
- `VITE_API_KEY` - Your Gemini API key

The Supabase database is already configured and ready to use.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Supabase (Database & Realtime)
- Google Gemini AI
- Recharts (Data visualization)

## View in AI Studio

https://ai.studio/apps/drive/1yCGQ0LMjy4WsMxw0MN8CFPrHIf7Am66y
