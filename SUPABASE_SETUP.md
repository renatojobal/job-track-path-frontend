# 🚀 Supabase Setup Guide for JobTrackPath

This guide will help you set up Supabase as the backend database for your JobTrackPath application.

## 📋 Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Basic knowledge of SQL (optional, but helpful)

## 🏗️ Step 1: Create a New Supabase Project

1. **Log in to Supabase Dashboard**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Sign in with your account

2. **Create New Project**
   - Click "New Project"
   - Choose your organization
   - Fill in project details:
     - **Name**: `jobtrackpath` (or your preferred name)
     - **Database Password**: Create a strong password (save this!)
     - **Region**: Choose closest to your users
   - Click "Create new project"

3. **Wait for Setup**
   - Project creation takes 2-3 minutes
   - You'll see a dashboard when ready

## 🔧 Step 2: Database Schema Setup

### Option A: Using SQL Editor (Recommended)

1. **Navigate to SQL Editor**
   - In your Supabase dashboard, go to "SQL Editor"
   - Click "New query"

2. **Run the Database Setup Script**
   Copy and paste this complete schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users NOT NULL,
    
    -- Basic Info
    company TEXT NOT NULL,
    position TEXT,
    company_description TEXT,
    tech_stack TEXT[], -- Array of tech tags
    
    -- Compensation
    salary_min DECIMAL,
    salary_max DECIMAL,
    bonus_rsu TEXT,
    raises TEXT,
    year_end_bonus TEXT,
    
    -- Benefits
    additional_benefits TEXT,
    health_insurance TEXT,
    vacation_days INTEGER,
    holidays TEXT,
    
    -- Work Details
    work_mode TEXT CHECK (work_mode IN ('remote', 'hybrid', 'onsite')),
    laptop_provided BOOLEAN,
    payment_method TEXT,
    
    -- Process
    interview_process TEXT,
    notes TEXT,
    status TEXT CHECK (status IN ('got_interview', 'in_process', 'accepted', 'rejected')) DEFAULT 'got_interview',
    
    -- Metadata
    application_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    position_order INTEGER -- For column ordering
);

-- Create conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users NOT NULL,
    
    conversation_date TIMESTAMP NOT NULL,
    response_date TIMESTAMP,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    status TEXT CHECK (status IN ('pending', 'responded', 'closed', 'follow_up')) DEFAULT 'pending',
    notes TEXT,
    channel TEXT CHECK (channel IN ('whatsapp', 'email', 'linkedin', 'phone', 'other')) NOT NULL,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create junction table for jobs <-> conversations
CREATE TABLE job_conversations (
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, conversation_id)
);

-- Create chat messages table (optional - for chat history)
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users NOT NULL,
    role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for jobs
CREATE POLICY "Users can only access their own jobs"
    ON jobs FOR ALL
    USING (auth.uid() = user_id);

-- Create RLS policies for conversations
CREATE POLICY "Users can only access their own conversations"
    ON conversations FOR ALL
    USING (auth.uid() = user_id);

-- Create RLS policies for job_conversations
CREATE POLICY "Users can only access their own job conversations"
    ON job_conversations FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM jobs 
            WHERE jobs.id = job_conversations.job_id 
            AND jobs.user_id = auth.uid()
        )
    );

-- Create RLS policies for chat_messages
CREATE POLICY "Users can only access their own chat messages"
    ON chat_messages FOR ALL
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_jobs_updated_at 
    BEFORE UPDATE ON jobs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at 
    BEFORE UPDATE ON conversations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

3. **Execute the Script**
   - Click "Run" to execute the schema
   - You should see "Success. No rows returned" message

### Option B: Using Table Editor (Alternative)

If you prefer a GUI approach, you can create tables manually using the "Table Editor" in the Supabase dashboard, but the SQL approach above is much faster.

## 🔐 Step 3: Configure Authentication

1. **Enable Authentication Providers**
   - Go to "Authentication" > "Settings"
   - Under "Site URL", add your development URL: `http://localhost:3000`
   - For production, add your deployed URL

2. **Configure Email Templates** (Optional)
   - Go to "Authentication" > "Email Templates"
   - Customize signup/login emails as needed

## 🔑 Step 4: Get Your Project Credentials

1. **Find Your Project URL and Keys**
   - Go to "Settings" > "API"
   - Copy these values:
     - **Project URL**: `https://xxxxxxxxx.supabase.co`
     - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

2. **Create Environment File**
   - In your project root, create `.env.local`:

```bash
# Copy from .env.local.example and fill in your values
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For n8n integration
N8N_WEBHOOK_URL=your-n8n-webhook-url
```

⚠️ **Important**: Never commit your `.env.local` file to version control!

## 🧪 Step 5: Test Your Setup

1. **Start Your Development Server**
   ```bash
   npm run dev
   ```

2. **Test the Connection**
   - Open your app at `http://localhost:3000`
   - The Kanban board should show loading state then either:
     - Empty columns (success! 🎉)
     - Error message (check your credentials)

3. **Test Adding a Job**
   - Click the blue "+" button (bottom left)
   - Fill in job details and submit
   - The job should appear on your Kanban board

## 🛠️ Step 6: Enable Real-time (Optional)

For real-time updates across devices:

1. **Enable Realtime**
   - Go to "Database" > "Replication"
   - Turn on replication for the `jobs` table
   - Turn on replication for the `conversations` table

2. **Add Realtime Subscriptions** (Future Enhancement)
   - Your app is already configured to work with Supabase
   - Real-time subscriptions can be added later for multi-user scenarios

## 🚀 Step 7: Production Deployment

### For Vercel Deployment:

1. **Add Environment Variables**
   - In Vercel dashboard, go to your project settings
   - Add the same environment variables from `.env.local`

2. **Update Site URL**
   - In Supabase Authentication settings
   - Add your production URL to allowed origins

### For Other Platforms:

- Add the same environment variables
- Ensure your deployment platform supports Next.js 15+

## 📊 Sample Data (Optional)

Want to see the app with sample data? Run this in your SQL Editor:

```sql
-- Insert sample jobs (replace 'user-uuid-here' with a real user ID after signup)
INSERT INTO jobs (user_id, company, position, salary_min, salary_max, tech_stack, work_mode, status, application_date) VALUES
('user-uuid-here', 'Google', 'Frontend Developer', 120000, 150000, ARRAY['React', 'TypeScript', 'Node.js'], 'remote', 'got_interview', '2024-01-15'),
('user-uuid-here', 'Microsoft', 'Full Stack Engineer', 130000, 160000, ARRAY['React', 'C#', '.NET'], 'hybrid', 'in_process', '2024-01-10'),
('user-uuid-here', 'Netflix', 'Senior Frontend Engineer', 170000, 200000, ARRAY['React', 'JavaScript', 'Node.js'], 'remote', 'accepted', '2024-01-05');
```

## 🔧 Troubleshooting

### Common Issues:

1. **"Error loading jobs"**
   - Check your environment variables
   - Verify Supabase project is running
   - Check browser console for detailed errors

2. **Authentication Issues**
   - Verify Site URL in Supabase settings
   - Check if RLS policies are correctly set up

3. **Database Connection Failed**
   - Double-check your Supabase URL and anon key
   - Ensure your project is not paused (free tier limitation)

4. **Jobs Not Appearing**
   - Make sure you're signed up/logged in
   - Check that RLS policies allow your user to access data

### Getting Help:

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Project Issues**: Check the GitHub repository

## 🎉 Success!

Once setup is complete, you'll have:

- ✅ Fully functional database with RLS security
- ✅ User authentication ready
- ✅ Real-time job tracking
- ✅ Scalable architecture for growth
- ✅ Production-ready backend

Your JobTrackPath application is now connected to a powerful, scalable database! 🚀

## 🔄 Next Steps

1. **Set up n8n workflows** for AI chat functionality
2. **Customize the UI** to match your preferences  
3. **Add authentication flows** for user signup/login
4. **Deploy to production** when ready

Happy job tracking! 💼✨