# AlgoVerse Deployment Guide - Render

## Prerequisites
- GitHub account with your AlgoVerse repository
- Render account (free tier available)
- MongoDB Atlas account (free tier available)

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Create a database user with read/write permissions
5. Get your connection string
6. Add your IP address to the IP whitelist (or use 0.0.0.0/0 for all IPs)

## Step 2: Deploy Backend to Render

1. **Sign up for Render**
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Backend Service**
   - **Name**: `algoverse-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Set Environment Variables**
   - Click "Environment" tab
   - Add the following variables:
     ```
     NODE_ENV=production
     PORT=10000
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_jwt_secret_key
     CORS_ORIGIN=https://your-frontend-domain.onrender.com
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://algoverse-backend.onrender.com`)

## Step 3: Deploy Frontend to Render

1. **Create New Static Site**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository (same repo)

2. **Configure Frontend Service**
   - **Name**: `algoverse-frontend`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`

3. **Set Environment Variables**
   - Add the following variable:
     ```
     REACT_APP_API_URL=https://your-backend-domain.onrender.com
     ```

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete
   - Note your frontend URL (e.g., `https://algoverse-frontend.onrender.com`)

## Step 4: Update CORS Configuration

1. Go back to your backend service
2. Update the `CORS_ORIGIN` environment variable with your frontend URL
3. Redeploy the backend service

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Test user registration/login
3. Test Codeforces handle analysis
4. Test all features

## Important Notes

### Render Free Tier Limitations
- **Backend**: 750 hours/month (about 31 days)
- **Frontend**: Unlimited
- **Sleep**: Services sleep after 15 minutes of inactivity
- **Cold Start**: First request after sleep may take 30-60 seconds

### Environment Variables Checklist
**Backend:**
- `NODE_ENV=production`
- `PORT=10000`
- `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/algoverse`
- `JWT_SECRET=your_secure_jwt_secret`
- `CORS_ORIGIN=https://your-frontend-domain.onrender.com`

**Frontend:**
- `REACT_APP_API_URL=https://your-backend-domain.onrender.com`

### Troubleshooting

1. **Backend not connecting to MongoDB**
   - Check MongoDB Atlas IP whitelist
   - Verify connection string format
   - Ensure database user has correct permissions

2. **CORS errors**
   - Verify CORS_ORIGIN matches your frontend URL exactly
   - Check for trailing slashes
   - Redeploy backend after changing CORS settings

3. **Build failures**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

4. **Environment variables not working**
   - Redeploy service after adding environment variables
   - Check variable names match exactly
   - Ensure no extra spaces in values

### Performance Optimization

1. **Enable Auto-Deploy**
   - Connect GitHub repository
   - Render will auto-deploy on push to main branch

2. **Monitor Usage**
   - Check Render dashboard for usage statistics
   - Monitor free tier limits

3. **Custom Domain (Optional)**
   - Add custom domain in Render dashboard
   - Update CORS_ORIGIN accordingly

## Support

If you encounter issues:
1. Check Render deployment logs
2. Verify all environment variables are set correctly
3. Test locally first
4. Check MongoDB Atlas connection
5. Review CORS configuration 