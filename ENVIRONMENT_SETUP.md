# 🔧 Environment Configuration Guide

JobTrackPath supports both **Demo Mode** (no setup required) and **Production Mode** (with Supabase backend).

## 🚀 Quick Start (Demo Mode)

The application is pre-configured to run in demo mode with mock authentication and data. Simply run:

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and you're ready to go! 

### Demo Mode Features:
- ✅ Mock authentication (any email/password works)
- ✅ Sample job data for testing
- ✅ All UI components functional
- ✅ No external dependencies required
- ⚠️ Data doesn't persist between sessions

## 🏗️ Production Setup (Supabase Backend)

For real data persistence and multi-user support, follow these steps:

### 1. Supabase Configuration

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create an account
   - Create a new project
   - Follow the detailed setup in `SUPABASE_SETUP.md`

2. **Update Environment Variables**
   
   Replace the values in `.env.local`:
   ```bash
   # Replace with your actual Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
   
   # Optional: For AI chat functionality
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chat
   ```

3. **Restart Development Server**
   ```bash
   npm run dev
   ```

### 2. n8n Integration (Optional)

For AI-powered chat assistance:

1. **Set up n8n instance** (local or cloud)
2. **Create chat workflow** with your preferred AI provider
3. **Add webhook URL** to `.env.local`

Without n8n, the chat widget will show helpful mock responses.

## 📁 Environment Files

| File | Purpose | Should Commit? |
|------|---------|----------------|
| `.env.local.example` | Template with instructions | ✅ Yes |
| `.env.local` | Your actual credentials | ❌ **NEVER** |

## 🔄 Switching Between Modes

### Demo Mode Detection
The app automatically detects demo mode when:
- No `.env.local` file exists, OR
- `NEXT_PUBLIC_SUPABASE_URL` is not set, OR
- `NEXT_PUBLIC_SUPABASE_URL` contains `demo.supabase.co`

### Force Demo Mode
To force demo mode even with Supabase configured:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://demo.supabase.co
```

### Force Production Mode
Ensure you have valid Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-real-key
```

## 🚨 Security Notes

1. **Never commit `.env.local`** - It's in `.gitignore` for a reason
2. **Regenerate keys** if accidentally exposed
3. **Use environment variables** in production deployment
4. **Enable RLS** in Supabase for data security

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
1. Ensure Next.js 15+ support
2. Add environment variables in platform settings
3. Set build command: `npm run build`
4. Set output directory: `.next`

## 🆘 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "supabaseUrl is required" | Check `.env.local` exists and has valid values |
| 404 on routes | Restart dev server after env changes |
| Authentication not working | Verify Supabase project URL and keys |
| Data not persisting | Confirm you're not in demo mode |

### Debug Mode
Add to `.env.local` for verbose logging:
```bash
NEXT_PUBLIC_DEBUG=true
```

### Reset Demo Data
Demo mode data resets on browser refresh. To clear:
```javascript
// In browser console
sessionStorage.clear()
localStorage.clear()
```

## 📞 Support

- **Supabase Issues**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Issues**: [nextjs.org/docs](https://nextjs.org/docs)  
- **Project Issues**: Check GitHub repository

---

**🎯 Pro Tip**: Start with demo mode to explore features, then switch to Supabase when you're ready for real data!