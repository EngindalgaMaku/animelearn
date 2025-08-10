# Coolify Deployment Fix Instructions

## Issues Resolved

1. **Conflicting Configuration**: Removed duplicate `next.config.ts` file that conflicted with `next.config.js`
2. **Missing Dockerfile**: Created optimized multi-stage Dockerfile for container deployment
3. **Content Security Policy**: Fixed overly restrictive CSP that was blocking JavaScript execution
4. **Static Asset Headers**: Added proper MIME types and caching headers for `_next/static/` files
5. **Font File Serving**: Fixed `.woff2` and `.woff` font file serving with proper headers and CORS
6. **Font Optimization**: Added font preloading, fallback fonts, and display:swap for better performance
7. **Middleware Configuration**: Created middleware to handle static asset serving and font files

## Deployment Steps

### 1. Push Changes to Repository

```bash
git add .
git commit -m "Fix Coolify deployment issues - static assets and CSP"
git push origin main
```

### 2. Redeploy in Coolify

1. Go to your Coolify dashboard
2. Navigate to your project
3. Click "Deploy" or "Redeploy"
4. Wait for the build to complete

### 3. Clear Browser Cache

After deployment:

- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or open in incognito/private mode to test

## Key Changes Made

### Content Security Policy

- Added `'unsafe-eval'` and `'unsafe-inline'` for scripts (required by Next.js)
- Relaxed image and font policies
- Proper connect-src for API calls

### Static Asset Serving

- Explicit MIME types for JavaScript and CSS files
- Long-term caching for immutable assets
- Proper charset specifications

### Docker Configuration

- Multi-stage build for optimal image size
- Standalone output mode for containerization
- Proper file permissions and user setup

## Expected Results

After deployment, you should see:

- ✅ No more 404 errors for `_next/static/` files
- ✅ No more MIME type errors in console
- ✅ No more "Refused to execute script" errors
- ✅ Application loads properly on first visit (no need for Shift+F5)

## Troubleshooting

If issues persist:

1. Check Coolify build logs for errors
2. Verify environment variables are set correctly
3. Ensure your domain/subdomain is configured properly
4. Test in incognito mode to rule out local cache issues
