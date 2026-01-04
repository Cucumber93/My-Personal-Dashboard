# Environment Variables Guide - Dashboard

## 📋 Overview

This project uses environment variables to configure the API endpoint and other settings. Environment variables are loaded from `.env` files.

## 🚀 Quick Start

### 1. Create `.env` file

Copy the example file:

```bash
cp env.example .env
```

### 2. Edit `.env` file

Open `.env` and configure your settings:

```env
VITE_API_URL=http://localhost:3100/api
NODE_ENV=development
```

### 3. Restart development server

```bash
pnpm run dev
```

## 📝 Available Variables

### `VITE_API_URL` (Required)

The base URL for the backend API.

**Examples:**

- **Local Development**: `http://localhost:3100/api`
- **Production**: `https://api.yourdomain.com/api`
- **Docker Network**: `http://backend:3001/api` (if running in Docker)

**Default**: `http://localhost:3100/api`

### `NODE_ENV` (Optional)

Environment mode: `development` or `production`

**Default**: `development`

### `VITE_APP_NAME` (Optional)

Application name (currently not used, but available for future use)

### `VITE_APP_VERSION` (Optional)

Application version (currently not used, but available for future use)

## 🔧 Configuration Examples

### Local Development

```env
VITE_API_URL=http://localhost:3100/api
NODE_ENV=development
```

### Production

```env
VITE_API_URL=https://api.yourdomain.com/api
NODE_ENV=production
```

### Docker Development

```env
VITE_API_URL=http://backend:3001/api
NODE_ENV=development
```

### Docker Production

```env
VITE_API_URL=http://backend:3001/api
NODE_ENV=production
```

## 📦 Build Time vs Runtime

**Important**: Vite environment variables are embedded at **build time**, not runtime.

This means:
- ✅ Changes to `.env` require rebuilding the app
- ✅ Different builds can have different API URLs
- ✅ Production builds should use production API URL

### Build for Production

```bash
# Set production API URL
echo "VITE_API_URL=https://api.yourdomain.com/api" > .env.production

# Build
pnpm run build

# The built files will have the production API URL embedded
```

## 🐳 Docker Usage

### Development Mode

In `docker-compose.dev.yml`, environment variables are passed:

```yaml
services:
  dashboard:
    environment:
      - VITE_API_URL=http://localhost:3001/api
```

### Production Mode

In Dockerfile, environment variables are set during build:

```dockerfile
ARG VITE_API_URL=http://localhost:3001/api
ENV VITE_API_URL=$VITE_API_URL
```

Or use `.env` file:

```bash
docker build --build-arg VITE_API_URL=https://api.yourdomain.com/api .
```

## 🔍 How It Works

Environment variables are accessed in code using:

```typescript
import.meta.env.VITE_API_URL
```

The `VITE_` prefix is required for Vite to expose the variable to client-side code.

## ⚠️ Security Notes

1. **Never commit `.env` files** - They may contain sensitive information
2. **Use `.env.example`** - Commit this file as a template
3. **Prefix with `VITE_`** - Only variables with this prefix are exposed to client
4. **No secrets in client** - Never put API keys or secrets in `VITE_` variables

## 🐛 Troubleshooting

### API calls failing

1. Check `.env` file exists and has correct values
2. Verify `VITE_API_URL` is set correctly
3. Restart dev server after changing `.env`
4. Check browser console for actual API URL being used

### Environment variable not working

1. Ensure variable name starts with `VITE_`
2. Restart dev server after changes
3. Rebuild for production builds
4. Check `import.meta.env` in browser console

### CORS errors

If you see CORS errors, ensure:
- Backend CORS is configured to allow your frontend origin
- API URL is correct
- Backend is running and accessible

## 📚 Related Files

- `src/services/api.ts` - Uses `VITE_API_URL`
- `vite.config.ts` - Vite configuration
- `.env.example` - Template file (commit this)
- `.env` - Your local config (don't commit)

## 🔄 Migration from Hardcoded URL

Previously, the API URL was hardcoded:

```typescript
// Old way
const API_BASE_URL = 'http://localhost:3001/api';
```

Now it uses environment variables:

```typescript
// New way
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3100/api';
```

This allows:
- ✅ Different URLs for dev/prod
- ✅ Easy configuration
- ✅ No code changes needed for different environments

