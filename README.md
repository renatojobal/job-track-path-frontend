JobTrackPath - Project Context for Development
Project Overview
JobTrackPath is a SaaS application for tracking job application processes with AI-powered updates via chat assistant. Users manage their job search pipeline through a Kanban board interface and track recruiter conversations.
Tech Stack

Frontend: Next.js 14+ (App Router, TypeScript, Tailwind CSS)
Backend: n8n workflows (hosted separately)
Database & Auth: Supabase (PostgreSQL, Row Level Security, Auth)
AI Assistant: Integrated via n8n (OpenAI/Claude API)
UI Components: shadcn/ui, Radix UI
Drag & Drop: @dnd-kit or react-beautiful-dnd

Core Features

1. Kanban Board (/board)
   Four columns representing job application stages:

Got Interview: Initial applications with interview scheduled
In Process: Active interview processes
Accepted: Job offers received
Rejected: Applications that didn't proceed

Functionality:

Drag-and-drop cards between columns
Card shows: Company, Position, Salary, Tech Stack, Remote status
Click card to open detail modal
Filters: salary range, tech stack, remote/hybrid, date range
Sort by: date added, salary, company name

2. AI Chat Assistant
   Persistent chat interface (sidebar or bottom-right widget) that allows:

Natural language job entry: "Add Google interview, $150k, React/Node, fully remote"
Status updates: "Move Microsoft to Accepted"
Query data: "Show all jobs paying over $100k"
Add notes: "Add note to Amazon: great culture vibes"

Flow:

User types message in chat
Frontend sends to n8n webhook
n8n processes with LLM (intent classification, entity extraction)
n8n performs DB operations via Supabase API
n8n returns structured response
Frontend updates UI and shows confirmation

3. Job Application Details
   Each job has these fields (all optional except Company):
   Basic Info:

Company Name - REQUIRED
Position (Job Title)
Company Description (Industry/what the company does)
Tech Stack (Multi-select tags)

Compensation:

Salary (Number or range)
Bonus/RSU (Bonus/Stock options)
Raises (Raise policy - text)
Year-end Bonus (13th month bonus - yes/no/percentage)

Benefits:

Additional Benefits (Extra perks - text)
Health Insurance (Insurance details)
Vacation Days (PTO days - number)
Holidays (Holiday policy)

Work Details:

Work Mode (Remote/Hybrid/On-site - dropdown)
Laptop Provided (Company provides laptop - yes/no)
Payment Method (Transfer/Check/Crypto)

Process:

Interview Process (Interview stages - text or structured)
Extra Notes (Vibes/impressions - rich text)
Application Date (Auto or manual)
Current Status (Matches column)

4. Conversations Tab (/conversations)
   Separate view to track all recruiter/company communications.
   List View:

Table showing all conversations
Columns: Company, Contact Name, Last Contact Date, Status, Channel
Filter by status, date range, linked job
Click row to see details

Conversation Fields:

Conversation Date (When conversation happened)
Response Date (Response due date / date responded)
Full Name (Contact person's full name)
Phone (Phone number)
Email (Email address)
Status (Pending/Responded/Closed/Follow-up needed)
Notes (Observations about conversation)
Communication Channel (WhatsApp/Email/LinkedIn/Phone/Other)
Linked Jobs (Many-to-many relationship)

Detail View:

Timeline of conversation events
Quick actions: "Mark as responded", "Schedule follow-up", "Link to job"
Rich text editor for notes

5. Dashboard (Optional for MVP)

Total applications by status (pie chart)
Recent activity feed
Average salary by status
Tech stack frequency
Interview conversion rate

Database Schema (Supabase)
sql-- Users (handled by Supabase Auth)

-- Job Applications
CREATE TABLE jobs (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES auth.users NOT NULL,

-- Basic
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

-- Work
work_mode TEXT CHECK (work_mode IN ('remote', 'hybrid', 'onsite')),
laptop_provided BOOLEAN,
payment_method TEXT,

-- Process
interview_process TEXT,
notes TEXT,
status TEXT CHECK (status IN ('got_interview', 'in_process', 'accepted', 'rejected')),

-- Metadata
application_date TIMESTAMP DEFAULT NOW(),
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW(),
position_order INTEGER -- For column ordering
);

-- Conversations
CREATE TABLE conversations (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES auth.users NOT NULL,

conversation_date TIMESTAMP NOT NULL,
response_date TIMESTAMP,
full_name TEXT NOT NULL,
phone TEXT,
email TEXT,
status TEXT CHECK (status IN ('pending', 'responded', 'closed', 'follow_up')),
notes TEXT,
channel TEXT CHECK (channel IN ('whatsapp', 'email', 'linkedin', 'phone', 'other')),

created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);

-- Junction table for jobs <-> conversations
CREATE TABLE job_conversations (
job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
PRIMARY KEY (job_id, conversation_id)
);

-- Chat history (optional - for showing assistant chat history)
CREATE TABLE chat_messages (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES auth.users NOT NULL,
role TEXT CHECK (role IN ('user', 'assistant')),
content TEXT NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies (enable RLS on all tables)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Example policy for jobs (repeat for other tables)
CREATE POLICY "Users can only access their own jobs"
ON jobs FOR ALL
USING (auth.uid() = user_id);

```

## n8n Workflow Architecture

**Webhook Endpoint**: `/webhook/chat`

**Workflow Steps**:
1. **Webhook Trigger** - Receives: `{ message: string, userId: string }`
2. **OpenAI/Claude Node** - Prompt:
```

You are a job tracking assistant. Parse this user message and respond with JSON:
{
"intent": "create_job|update_status|query|add_note",
"entities": {
"company": "string",
"status": "got_interview|in_process|accepted|rejected",
"salary": number,
"tech_stack": ["string"],
"field": "string",
"value": "any",
...
},
"response": "Friendly confirmation message"
}

User message: {message}

```
3. **Switch Node** - Route by intent
4. **Supabase Nodes** - INSERT/UPDATE/SELECT based on intent
5. **Response Node** - Return: `{ success: boolean, message: string, data?: any }`

**Example Intents**:
- "Add Meta interview, $180k, React/GraphQL, remote" → Create job
- "Move Amazon to Accepted" → Update status
- "Show jobs over $120k" → Query and return list
- "Add note to Google: waiting for recruiter" → Update notes

## Frontend Structure
```

/app
├── (auth)
│ ├── login/
│ └── signup/
├── (dashboard)
│ ├── layout.tsx # Includes nav, chat widget
│ ├── board/
│ │ └── page.tsx # Kanban board
│ ├── conversations/
│ │ ├── page.tsx # List view
│ │ └── [id]/page.tsx # Detail view
│ └── analytics/ # Optional
/components
├── kanban/
│ ├── Board.tsx
│ ├── Column.tsx
│ └── JobCard.tsx
├── chat/
│ ├── ChatWidget.tsx
│ └── ChatMessage.tsx
├── forms/
│ ├── JobForm.tsx
│ └── ConversationForm.tsx
└── ui/ # shadcn components
/lib
├── supabase.ts # Supabase client
├── hooks/
│ ├── useJobs.ts
│ └── useConversations.ts
└── types.ts # TypeScript types
Key User Flows
Flow 1: Add Job via Chat

User opens chat: "Add Apple interview, $160k, Swift/iOS, hybrid"
System sends to n8n
n8n creates job in DB
Chat shows: "✅ Added Apple to Got Interview ($160k, Swift/iOS, Hybrid)"
Kanban board updates in real-time via Supabase subscription

Flow 2: Update Status via Drag

User drags Google card from "In Process" to "Accepted"
Frontend updates Supabase
System logs update
Card moves to new column

Flow 3: Link Conversation to Job

User creates conversation with "John - Google Recruiter"
In conversation detail, clicks "Link to job"
Selects "Google - Software Engineer" from modal
Junction record created
Conversation shows linked job badge

Implementation Priorities
Phase 1 - Core MVP (Week 1-2):

Supabase setup + auth
Basic Kanban board with manual CRUD
Job detail modal with all fields
Conversations list + detail CRUD

Phase 2 - AI Integration (Week 2-3):

Chat UI component
n8n workflow setup
Basic intent handling (create, update status)
Real-time updates

Phase 3 - Polish (Week 3-4):

Advanced filters/search
Link conversations to jobs
Analytics dashboard
Mobile responsive
Error handling + loading states

Environment Variables
env# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
N8N_WEBHOOK_URL=your_n8n_webhook_url
Design Guidelines

Primary color: Blue (#3B82F6) - professional, trustworthy
Use card-based UI for jobs and conversations
Empty states with helpful CTAs
Loading skeletons for async data
Toast notifications for actions
Responsive: mobile-first, works on tablet/desktop

Success Metrics

User can add a job in <30 seconds via chat
Drag-and-drop feels smooth (60fps)
Chat responds in <2 seconds
All data persists correctly with RLS
Works on mobile browsers
