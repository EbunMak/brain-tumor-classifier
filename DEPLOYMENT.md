# Deployment Guide: Render + Vercel

This guide will walk you through deploying your Brain Tumor MRI Classifier to the cloud for free.

## Overview

- **Backend (Python/FastAPI)**: Deploy to Render.com (Free tier available)
- **Frontend (React)**: Deploy to Vercel (Free tier available)
- **Total time**: 10-15 minutes
- **Cost**: $0 (Free tiers)

---

## Part 1: Deploy Backend to Render

### Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** button (top right) → **"New repository"**
3. Name it: `brain-tumor-classifier`
4. Set to **Public**
5. Click **"Create repository"**

### Step 2: Push Your Code to GitHub

Open your terminal in the project directory and run:

```bash
git init
git add .
git commit -m "Initial commit: Brain tumor classifier"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/brain-tumor-classifier.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 3: Deploy to Render

1. Go to [Render.com](https://render.com) and sign up (use GitHub to sign in)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if prompted
4. Select your `brain-tumor-classifier` repository
5. Configure the service:

   **Settings:**
   - **Name**: `brain-tumor-api`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```
     cd backend && pip install -r requirements.txt
     ```
   - **Start Command**:
     ```
     cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type**: `Free`

6. Click **"Create Web Service"**

7. Wait 5-10 minutes for deployment to complete

8. Once deployed, copy your backend URL (looks like: `https://brain-tumor-api.onrender.com`)

### Important Notes About Render Free Tier:

- Your service will spin down after 15 minutes of inactivity
- First request after inactivity will take 30-60 seconds (cold start)
- This is normal for the free tier!

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Configure Environment Variable

Before deploying, you need to tell the frontend where your backend is:

1. Your backend URL from Render (e.g., `https://brain-tumor-api.onrender.com`)
2. Keep it handy for the next step

### Step 2: Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com) and sign up (use GitHub to sign in)
2. Click **"Add New..."** → **"Project"**
3. Import your `brain-tumor-classifier` repository
4. Configure project:

   **Settings:**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variable:**
   - Click **"Environment Variables"**
   - Add variable:
     - **Name**: `VITE_API_URL`
     - **Value**: Your Render backend URL (e.g., `https://brain-tumor-api.onrender.com`)
   - Make sure to add it for **Production**, **Preview**, and **Development**

6. Click **"Deploy"**

7. Wait 2-3 minutes for deployment

8. Your app will be live at: `https://your-project.vercel.app`

---

## Part 3: Test Your Deployed App

1. Visit your Vercel URL (e.g., `https://brain-tumor-classifier.vercel.app`)
2. Upload a brain MRI image
3. Click "Classify MRI"
4. View results!

### If the first request is slow:

This is normal! Render's free tier spins down after 15 minutes of inactivity. The first request "wakes up" the server and takes 30-60 seconds. Subsequent requests will be fast.

---

## Troubleshooting

### Backend Issues

**Problem**: "Failed to connect to the server"

**Solutions**:
1. Check if your Render service is running (go to Render dashboard)
2. Verify the backend URL in Vercel environment variables
3. Check Render logs for errors (click on your service → "Logs")
4. Make sure the model file was committed to GitHub (check repository)

### Frontend Issues

**Problem**: Page loads but API calls fail

**Solutions**:
1. Check environment variable in Vercel:
   - Go to your project → Settings → Environment Variables
   - Verify `VITE_API_URL` is set correctly
   - If you change it, redeploy: Deployments → Three dots → Redeploy

**Problem**: CORS errors in browser console

**Solution**: The backend already has CORS enabled. If you still see errors:
1. Make sure your backend URL doesn't have a trailing slash
2. Check that the backend is actually running on Render

### Cold Starts

**Problem**: First request takes 30-60 seconds

**Solution**: This is expected on Render's free tier. Options:
1. Wait for it (it's just the first request)
2. Upgrade to Render's paid tier ($7/month for always-on)
3. Use a "ping" service to keep your backend warm (like cron-job.org)

---

## Updating Your Deployment

### To update your app after making changes:

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. Both Render and Vercel will auto-deploy your changes!

---

## Custom Domain (Optional)

### Vercel:
1. Go to your project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Render:
1. Go to your service → Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

---

## Cost Breakdown

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Render** | 750 hours/month<br>Spins down after 15 min | $7/month<br>Always on |
| **Vercel** | Unlimited deployments<br>100GB bandwidth | $20/month<br>1TB bandwidth |
| **Total** | **$0/month** | $27/month |

For a portfolio project or demo, the free tier is perfect!

---

## Security Notes

- The model file is public in your GitHub repo (this is fine for a demo)
- No API keys or secrets are needed
- File uploads are validated (max 10MB, images only)
- CORS is configured for security

---

## What You've Deployed

- **Frontend**: Beautiful React app with drag-and-drop upload
- **Backend**: FastAPI server running TensorFlow model
- **Model**: 1.5MB Keras model for brain tumor classification
- **Features**: Real-time predictions, confidence scores, responsive design

Your app is now live and accessible from anywhere in the world!

---

## Questions?

If you run into issues:
1. Check the Render logs for backend errors
2. Check browser console (F12) for frontend errors
3. Verify environment variables are set correctly
4. Make sure your GitHub repo has all files (especially the model)

Happy deploying! 🚀
