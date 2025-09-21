# 🚀 Deploying FoodGoggles to Vercel

This guide will walk you through deploying your FoodGoggles app to Vercel with a PostgreSQL database.

## Prerequisites

- [Vercel account](https://vercel.com) (free tier available)
- [Google Gemini API key](https://makersuite.google.com/app/apikey)
- [PostgreSQL database](https://vercel.com/storage/postgres) (Vercel Postgres recommended)

## Step 1: Prepare Your Repository

1. **Commit your changes** to Git:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Verify your project structure** includes:
   - `vercel.json` ✅ (created)
   - `package.json` with updated build scripts ✅ (updated)
   - `prisma/schema.prisma` configured for PostgreSQL ✅ (updated)

## Step 2: Set Up PostgreSQL Database

### Option A: Vercel Postgres (Recommended)
1. Go to [Vercel Storage](https://vercel.com/storage)
2. Click "Create Database" → "Postgres"
3. Choose your project and region
4. Copy the connection string (you'll need this for environment variables)

### Option B: External PostgreSQL
- Use services like [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app)
- Get your connection string in format: `postgresql://user:pass@host:port/database`

## Step 3: Deploy to Vercel

### Method 1: Vercel CLI (Recommended)
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   vercel
   ```
   - Follow the prompts to link your project
   - Choose your Git repository when prompted

### Method 2: Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Vercel will auto-detect it's a Next.js project

## Step 4: Configure Environment Variables

1. **In Vercel Dashboard**:
   - Go to your project → Settings → Environment Variables
   - Add the following variables:

   ```
   DATABASE_URL = postgresql://your-connection-string
   GEMINI_API_KEY = your-gemini-api-key
   ```

2. **Set environment scope**:
   - Production: ✅
   - Preview: ✅
   - Development: ✅

## Step 5: Run Database Migrations

After your first deployment, you need to set up your database schema:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Run migrations**:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

   Or use Vercel's built-in terminal:
   ```bash
   vercel exec "npx prisma migrate deploy"
   ```

## Step 6: Verify Deployment

1. **Check your deployment**:
   - Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
   - Test the meal logging functionality
   - Verify AI analysis is working

2. **Monitor logs**:
   - Go to Vercel Dashboard → Functions tab
   - Check for any errors in your API routes

## Step 7: Set Up Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check that `prisma generate` runs successfully
   - Verify all dependencies are in `package.json`

2. **Database Connection Issues**:
   - Verify `DATABASE_URL` is correctly set
   - Check PostgreSQL database is accessible

3. **API Key Issues**:
   - Verify `GEMINI_API_KEY` is set correctly
   - Check API key has proper permissions

4. **Migration Issues**:
   - Run `npx prisma migrate reset` if needed
   - Check database permissions

### Useful Commands:

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Pull environment variables locally
vercel env pull .env.local

# Run database operations
npx prisma studio
npx prisma migrate status
```

## Environment-Specific Configuration

### Local Development
Create `.env.local`:
```bash
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your-api-key"
```

### Production
Environment variables are managed through Vercel Dashboard.

## Security Best Practices

- ✅ Never commit `.env` files
- ✅ Use strong database passwords
- ✅ Rotate API keys regularly
- ✅ Enable Vercel's security features
- ✅ Use HTTPS (enabled by default on Vercel)

## Cost Considerations

- **Vercel**: Free tier includes 100GB bandwidth/month
- **Vercel Postgres**: Free tier includes 1GB storage
- **Google Gemini**: Pay-per-use pricing

## Next Steps

After successful deployment:
1. Set up monitoring and analytics
2. Configure automated backups
3. Set up staging environment
4. Implement CI/CD pipeline

---

🎉 **Congratulations!** Your FoodGoggles app is now live on Vercel!
