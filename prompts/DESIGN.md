# Magic Pattern Prompt for JobTrackPath UI Design

## Project Overview
Design a modern SaaS web application called "JobTrackPath" for tracking job applications with AI-powered chat assistance. The app helps users manage their job search pipeline through a Kanban board interface and track recruiter conversations.

## Design Requirements

### Tech Stack & Framework
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **UI Library**: shadcn/ui components with Radix UI
- **Design System**: Modern, professional, clean aesthetic
- **Primary Color**: Blue (#3B82F6) - professional and trustworthy
- **Layout**: Responsive design (mobile-first, works on tablet/desktop)

### Core Pages to Design

#### 1. Kanban Board (/board) - Main Dashboard
**Layout**: 
- Header with navigation, filters, and user menu
- Four-column Kanban layout with drag-and-drop cards
- Persistent chat widget (bottom-right or sidebar)

**Columns**:
1. "Got Interview" - Initial applications with interviews scheduled
2. "In Process" - Active interview processes  
3. "Accepted" - Job offers received
4. "Rejected" - Applications that didn't proceed

**Job Cards** should display:
- Company name (prominent)
- Position title
- Salary range
- Tech stack (as tags/badges)
- Remote/Hybrid/On-site indicator
- Application date
- Small drag handle icon

**Filters Bar** (above columns):
- Salary range slider
- Tech stack multi-select dropdown
- Work mode filter (Remote/Hybrid/On-site)
- Date range picker
- Sort options (date, salary, company name)

**Chat Widget**:
- Floating chat bubble or collapsible sidebar
- Chat interface with message history
- Input field with send button
- Examples of commands users can type

#### 2. Job Detail Modal
**Triggered by**: Clicking on any job card
**Layout**: Large modal/drawer with tabs or sections

**Fields to include**:
- **Basic Info**: Company, Position, Description, Tech Stack
- **Compensation**: Salary, Bonus/RSU, Raises, Year-end Bonus
- **Benefits**: Additional Benefits, Health Insurance, Vacation Days, Holidays  
- **Work Details**: Work Mode, Laptop Provided, Payment Method
- **Process**: Interview Process, Notes, Application Date, Status
- **Actions**: Edit, Delete, Move to different status

#### 3. Conversations Page (/conversations)
**Layout**: Split between list view and detail view

**List View** (left side or main view):
- Table/card layout showing conversations
- Columns: Company, Contact Name, Last Contact, Status, Channel
- Filter options: Status, Date range, Linked jobs
- Search functionality
- "Add New Conversation" button

**Conversation Detail** (right side or separate view):
- Contact information form
- Timeline of conversation events
- Rich text editor for notes
- Quick action buttons: "Mark as Responded", "Schedule Follow-up", "Link to Job"
- Many-to-many job linking interface

**Conversation Fields**:
- Conversation Date, Response Date
- Full Name, Phone, Email
- Status (Pending/Responded/Closed/Follow-up)
- Communication Channel (WhatsApp/Email/LinkedIn/Phone/Other)
- Notes section
- Linked Jobs list

#### 4. Authentication Pages
- **Login Page**: Clean, centered form with Supabase auth
- **Signup Page**: Registration form with terms acceptance
- **Layout**: Minimal, focused on conversion

### UI Components to Design

#### Navigation
- Top navigation bar with:
  - JobTrackPath logo
  - Main navigation (Board, Conversations, Analytics)
  - User profile dropdown
  - Notifications icon

#### Chat Interface
- **Chat Widget**: Collapsible/expandable chat interface
- **Message Types**: User messages, AI responses, system confirmations
- **Input Area**: Text input with example prompts
- **Example Commands** to show:
  - "Add Google interview, $150k, React/Node, fully remote"
  - "Move Microsoft to Accepted"
  - "Show all jobs paying over $100k"
  - "Add note to Amazon: great culture vibes"

#### Cards & Data Display
- **Job Cards**: Consistent card design with proper information hierarchy
- **Conversation Cards**: Contact-focused card layout
- **Empty States**: Helpful illustrations and CTAs for empty boards/lists
- **Loading States**: Skeleton screens for async data loading

#### Forms
- **Job Creation/Edit Form**: All job fields with proper input types
- **Conversation Form**: Contact and communication tracking
- **Filter Forms**: Advanced filtering interfaces

### Design Guidelines

#### Visual Style
- **Typography**: Clean, readable fonts (Inter or similar)
- **Spacing**: Generous whitespace, proper card spacing
- **Colors**: 
  - Primary: Blue (#3B82F6)
  - Success: Green for accepted jobs
  - Warning: Yellow/Orange for pending items
  - Error: Red for rejected applications
  - Neutral grays for backgrounds and text
- **Icons**: Consistent icon set (Lucide React or Heroicons)
- **Shadows**: Subtle shadows for depth and hierarchy

#### Interactive Elements
- **Drag & Drop**: Visual feedback for draggable cards
- **Hover States**: Clear hover effects on interactive elements
- **Loading**: Loading spinners and skeleton screens
- **Notifications**: Toast notifications for actions
- **Micro-interactions**: Smooth transitions and animations

#### Responsive Behavior
- **Mobile**: Stack columns vertically, collapsible chat
- **Tablet**: Two-column layout with responsive navigation
- **Desktop**: Full four-column Kanban with sidebar chat

### Key User Flows to Consider

1. **First-time User**: Empty state with onboarding prompts
2. **Adding Jobs**: Both manual form and AI chat methods
3. **Status Updates**: Drag-and-drop between columns
4. **Conversation Management**: Creating and linking conversations to jobs
5. **Filtering/Searching**: Finding specific jobs or conversations

### Success Criteria
- Interface feels modern and professional
- Drag-and-drop interactions are intuitive
- Chat interface encourages natural language input
- Information hierarchy is clear and scannable
- Works seamlessly across all device sizes
- Loading and empty states provide clear guidance

### Technical Considerations
- Design should work with shadcn/ui component library
- Consider Tailwind CSS utility classes
- Ensure accessibility (proper contrast, keyboard navigation)
- Optimize for performance (minimize layout shifts)

Please create high-fidelity mockups for these interfaces, focusing on the Kanban board as the primary interface, with supporting designs for the conversations page and job detail modal.