# FOMO Platform - Quick Deployment Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend && pip install -r requirements.txt

# Frontend  
cd frontend && yarn install
```

### 2. Configure Environment

**Backend `.env`:**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=fomo_db
ADMIN_PASSWORD=your_admin_password
```

**Frontend `.env`:**
```env
REACT_APP_BACKEND_URL=https://your-domain.com
```

### 3. Initialize Database

```bash
# Initialize all database collections
python scripts/init_database.py

# Initialize Cookie Consent with policies
python scripts/init_cookie_consent.py
```

### 4. Start Services

```bash
# Backend (port 8001)
cd backend && uvicorn server:app --host 0.0.0.0 --port 8001

# Frontend (port 3000)
cd frontend && yarn start
```

---

## 📋 Session Changes Summary

### Mobile Bug Fixes (20 bugs)
All mobile responsiveness issues from `MOBILE_BUGS.md` are fixed in:
- `/frontend/src/styles/mobile-bug-fixes.css`

### Cookie Consent System
New feature implemented:
- **Banner:** `/frontend/src/components/CookieConsent.js`
- **Admin Panel:** `/frontend/src/components/admin/sections/CookieConsentSection.js`
- **Backend API:** `GET/PUT /api/cookie-consent-settings`
- **Init Script:** `/scripts/init_cookie_consent.py`

---

## 📖 Full Documentation

See `DEPLOYMENT_GUIDE.md` for complete documentation including:
- Detailed bug fix descriptions
- API endpoints reference
- Database schema
- Admin panel configuration
- Troubleshooting guide

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Website loads without console errors
- [ ] Cookie consent banner appears on first visit
- [ ] Clicking policy links opens modals with content
- [ ] Admin panel accessible with password
- [ ] Cookie Consent section has 4 tabs (General, Cookie Policy, Privacy Policy, Terms)
- [ ] Mobile layout works on 320px, 375px, 768px screens

---

*Last updated: December 29, 2025*
