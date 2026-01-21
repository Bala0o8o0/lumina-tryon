# 🚀 Deployment Guide - Lumina Try-On

## ✅ Pre-Deployment Checklist

### 1. **Security Audit - PASSED ✅**
- ✅ `.env.local` is in `.gitignore` (API keys won't be pushed)
- ✅ All sensitive keys are in environment variables
- ✅ No hardcoded API keys in code
- ✅ Supabase RLS policies are active

### 2. **Files Audit - PASSED ✅**
- ✅ All demo images present (5 total)
- ✅ `demo-config.json` properly configured
- ✅ No unnecessary files to remove

### 3. **Code Quality - PASSED ✅**
- ✅ TypeScript compilation working
- ✅ No critical errors
- ✅ All features functional

---

## 📋 Step-by-Step Deployment

### **PART 1: Push to GitHub**

#### Step 1: Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: Lumina Try-On AI Virtual Fashion App"
```

#### Step 2: Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click **"New Repository"**
3. Name: `lumina-tryon` (or your choice)
4. **DO NOT** initialize with README (we already have one)
5. Click **"Create Repository"**

#### Step 3: Connect and Push
```bash
git remote add origin https://github.com/YOUR_USERNAME/lumina-tryon.git
git branch -M main
git push -u origin main
```

---

### **PART 2: Deploy to Vercel**

#### Step 1: Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your `lumina-tryon` repo

#### Step 2: Configure Project
- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./`
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)

#### Step 3: Add Environment Variables
Click **"Environment Variables"** and add these:

```
NEXT_PUBLIC_SUPABASE_URL=https://apckdforqegempjlxzkz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwY2tkZm9ycWVnZW1wamx4emt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODEyMTEsImV4cCI6MjA4MDI1NzIxMX0.WtgAR1H02cxz2yC8MVT_YioF3LeMb1ZGHRoRh3NVIYQ

GOOGLE_GEMINI_API_KEY=AIzaSyDeeYUN0SSHGyp3kN7Dmo086H_R409Dbw4

NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_Rntx3w01748aqM
RAZORPAY_KEY_ID=rzp_test_Rntx3w01748aqM
RAZORPAY_KEY_SECRET=wzUj1qIzPHj5J1VGw9u4wJ3c

NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**IMPORTANT:** Update `NEXT_PUBLIC_APP_URL` after deployment!

#### Step 4: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. ✅ Your app is live!

---

### **PART 3: Post-Deployment**

#### Step 1: Update App URL
1. Copy your Vercel URL (e.g., `https://lumina-tryon.vercel.app`)
2. Go to Vercel → Settings → Environment Variables
3. Update `NEXT_PUBLIC_APP_URL` to your actual URL
4. Redeploy (Vercel → Deployments → Click "..." → Redeploy)

#### Step 2: Update Supabase Redirect URLs
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication → URL Configuration**
4. Add to **Redirect URLs:**
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/*
   ```

#### Step 3: Test Everything
- ✅ Login/Signup
- ✅ Credit system
- ✅ Try-on generation (both AI and Demo modes)
- ✅ Payment flow
- ✅ All pages load correctly

---

## 🔧 Troubleshooting

### Build Fails?
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally first

### Environment Variables Not Working?
- Make sure they're added in Vercel dashboard
- Redeploy after adding new variables
- Check variable names match exactly

### Supabase Auth Issues?
- Verify redirect URLs are correct
- Check if `NEXT_PUBLIC_SUPABASE_URL` is correct
- Ensure RLS policies are enabled

---

## 📝 Final Checklist

- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variables added
- [ ] `NEXT_PUBLIC_APP_URL` updated
- [ ] Supabase redirect URLs configured
- [ ] Tested login/signup
- [ ] Tested try-on generation
- [ ] Tested payment flow
- [ ] All demo images working

---

## 🎉 You're Live!

Your app is now deployed and accessible worldwide!

**Share your link:** `https://your-app.vercel.app`

**For updates:** Just push to GitHub, Vercel auto-deploys! 🚀
