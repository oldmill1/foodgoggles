# Environment Variables for FoodGoggles

## Required Environment Variables

### Database
- `DATABASE_URL`: PostgreSQL connection string for production
  - Format: `postgresql://username:password@host:port/database`
  - Example: `postgresql://user:pass@localhost:5432/foodgoggles`

### AI API
- `GEMINI_API_KEY`: Google Gemini API key for meal analysis
  - Get from: https://makersuite.google.com/app/apikey
  - Required for the `/api/analyze-meal` endpoint

## Local Development Setup

Create a `.env.local` file in your project root:

```bash
# Database (SQLite for local development)
DATABASE_URL="file:./dev.db"

# AI API Key
GEMINI_API_KEY="your-gemini-api-key-here"
```

## Production Setup (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

### For Production:
- `DATABASE_URL`: Your PostgreSQL connection string
- `GEMINI_API_KEY`: Your Google Gemini API key

### For Preview/Development:
- Same variables as production

## Database Migration

After setting up your PostgreSQL database, run:

```bash
npx prisma migrate deploy
npx prisma generate
```

## Security Notes

- Never commit `.env.local` or `.env` files to version control
- Use strong, unique passwords for your database
- Rotate your API keys regularly
- Consider using Vercel's environment variable encryption for sensitive data
