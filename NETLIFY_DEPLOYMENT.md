# Netlify Deployment Guide

This guide will help you deploy the Arena of Consciousness application to Netlify.

## Prerequisites

- A Netlify account (sign up at https://netlify.com)
- Git repository with your code (GitHub, GitLab, or Bitbucket)
- LiveKit account and credentials

## Deployment Steps

### 1. Install Netlify CLI (Optional, for local testing)

```bash
npm install -g netlify-cli
```

### 2. Deploy via Netlify Dashboard

1. **Connect Your Repository**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - The `netlify.toml` file will automatically configure these settings

3. **Set Environment Variables**
   Go to Site settings → Environment variables and add:
   
   ```
   LIVEKIT_URL=wss://your-livekit-server.livekit.cloud
   LIVEKIT_API_KEY=your_api_key_here
   LIVEKIT_API_SECRET=your_api_secret_here
   NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-server.livekit.cloud
   ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your site
   - You'll get a URL like `https://your-site-name.netlify.app`

### 3. Deploy via Netlify CLI (Alternative)

```bash
# Login to Netlify
netlify login

# Initialize Netlify site
netlify init

# Deploy
netlify deploy --prod
```

## Important Configuration

### Environment Variables

Make sure all environment variables are set in Netlify:

- `LIVEKIT_URL` - Your LiveKit server URL
- `LIVEKIT_API_KEY` - Your LiveKit API key  
- `LIVEKIT_API_SECRET` - Your LiveKit API secret
- `NEXT_PUBLIC_LIVEKIT_URL` - Your LiveKit server URL (public)

### Netlify Plugin

The site uses the official Next.js plugin for Netlify (`@netlify/plugin-nextjs`) which is automatically configured in `netlify.toml`. This plugin:

- Handles Next.js API routes as Netlify Functions
- Optimizes static pages and images
- Supports ISR (Incremental Static Regeneration)
- Handles middleware

### API Routes

Your API routes are located at:
- `/api/token` - Generates LiveKit access tokens
- `/api/takeover` - Manages broadcaster takeover

These will automatically be deployed as Netlify Edge Functions.

## Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure your DNS

## Continuous Deployment

Netlify automatically deploys when you push to your main branch. You can:

- Configure branch deploys in Site settings → Build & deploy
- Set up deploy previews for pull requests
- Configure build hooks for external triggers

## Troubleshooting

### Build Fails

- Check the build logs in Netlify dashboard
- Verify all environment variables are set correctly
- Ensure Node version is 18 or higher

### API Routes Not Working

- Verify the `@netlify/plugin-nextjs` plugin is installed
- Check function logs in Netlify dashboard
- Ensure environment variables are available to functions

### LiveKit Connection Issues

- Verify `NEXT_PUBLIC_LIVEKIT_URL` is set correctly
- Check that your LiveKit server is accessible
- Verify API credentials are correct

## Support

- Netlify Documentation: https://docs.netlify.com
- Next.js on Netlify: https://docs.netlify.com/frameworks/next-js/overview/
- LiveKit Documentation: https://docs.livekit.io
