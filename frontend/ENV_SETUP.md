# Environment Variables Setup

## Configuration

All API calls in the frontend now use environment variables for easy deployment configuration.

## Setup Instructions

1. **Create a `.env` file** in the `frontend` directory (same level as `package.json`)

2. **Add the following variable** to your `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **For production deployment**, update the value to your production API URL:
   ```
   REACT_APP_API_URL=https://your-api-domain.com/api
   ```

## Notes

- The `.env` file should **NOT** be committed to version control (it's already in `.gitignore`)
- The default fallback URL is `http://localhost:5000/api` if the environment variable is not set
- All API calls are centralized through `src/config/api.js`
- You must restart your development server after changing `.env` variables

## Example `.env` file:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## For Deployment:

Update the `.env` file or set environment variables in your hosting platform:
- **Vercel**: Add in Project Settings > Environment Variables
- **Netlify**: Add in Site Settings > Build & Deploy > Environment Variables
- **Heroku**: Use `heroku config:set REACT_APP_API_URL=https://your-api-url.com/api`

