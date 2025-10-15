import { ChatMessage } from '@/types';

export interface ChatResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface ChatIntent {
  intent: 'create_job' | 'update_status' | 'query' | 'add_note' | 'unknown';
  entities: {
    company?: string;
    position?: string;
    status?: 'got_interview' | 'in_process' | 'accepted' | 'rejected';
    salary?: string;
    tech_stack?: string[];
    work_mode?: string;
    field?: string;
    value?: any;
  };
  response: string;
}

class ChatService {
  private n8nWebhookUrl: string;

  constructor() {
    this.n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || '';
  }

  async sendMessage(message: string, userId: string): Promise<ChatResponse> {
    try {
      // If n8n webhook is not configured, use mock responses
      if (!this.n8nWebhookUrl) {
        return this.getMockResponse(message);
      }

      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Chat service error:', error);
      return {
        success: false,
        message: 'Sorry, I encountered an error processing your request. Please try again.',
      };
    }
  }

  private getMockResponse(message: string): ChatResponse {
    const lowerMessage = message.toLowerCase();

    // Mock intent recognition and responses
    if (lowerMessage.includes('add') && (lowerMessage.includes('job') || lowerMessage.includes('interview'))) {
      return this.handleCreateJobIntent(message);
    }

    if (lowerMessage.includes('move') || lowerMessage.includes('update')) {
      return this.handleUpdateStatusIntent(message);
    }

    if (lowerMessage.includes('show') || lowerMessage.includes('list') || lowerMessage.includes('find')) {
      return this.handleQueryIntent(message);
    }

    if (lowerMessage.includes('note')) {
      return this.handleAddNoteIntent(message);
    }

    // Default help response
    return {
      success: true,
      message: `I can help you with:
      
• Adding jobs: "Add Google interview, $150k, React/Node, remote"
• Moving jobs: "Move Microsoft to Accepted"
• Querying jobs: "Show all jobs paying over $100k"
• Adding notes: "Add note to Amazon: great culture vibes"

What would you like to do?`,
    };
  }

  private handleCreateJobIntent(message: string): ChatResponse {
    // Extract company name (simple pattern matching)
    const companyMatch = message.match(/add\s+(\w+)/i);
    const company = companyMatch ? companyMatch[1] : 'Unknown Company';

    // Extract salary information
    const salaryMatch = message.match(/\$[\d,]+k?/g);
    const salary = salaryMatch ? salaryMatch[0] : 'Not specified';

    // Extract tech stack
    const techMatch = message.match(/(react|node|typescript|javascript|python|java|go|rust|vue|angular|\.net|c#)/gi);
    const techStack = techMatch || [];

    // Extract work mode
    const workModeMatch = message.match(/(remote|hybrid|on-site|onsite)/i);
    const workMode = workModeMatch ? workModeMatch[1] : 'Not specified';

    return {
      success: true,
      message: `✅ I've added ${company} to your "Got Interview" column with the following details:
      
• Salary: ${salary}
• Tech Stack: ${techStack.length > 0 ? techStack.join(', ') : 'Not specified'}
• Work Mode: ${workMode}

The job card will appear on your Kanban board shortly. You can click on it to add more details!`,
      data: {
        intent: 'create_job',
        entities: {
          company,
          salary,
          tech_stack: techStack,
          work_mode: workMode,
          status: 'got_interview',
        },
      },
    };
  }

  private handleUpdateStatusIntent(message: string): ChatResponse {
    const companyMatch = message.match(/move\s+(\w+)\s+to\s+(accepted|rejected|in\s+process|got\s+interview)/i);
    
    if (companyMatch) {
      const company = companyMatch[1];
      const newStatus = companyMatch[2].toLowerCase().replace(/\s+/g, '_');
      
      return {
        success: true,
        message: `✅ I've moved ${company} to "${this.formatStatusName(newStatus)}" column. The card has been updated on your Kanban board.`,
        data: {
          intent: 'update_status',
          entities: {
            company,
            status: newStatus,
          },
        },
      };
    }

    return {
      success: true,
      message: 'I need more information. Please specify which company to move and the target status. For example: "Move Google to Accepted"',
    };
  }

  private handleQueryIntent(message: string): ChatResponse {
    const salaryMatch = message.match(/over\s+\$?([\d,]+)k?/i);
    
    if (salaryMatch) {
      const amount = salaryMatch[1];
      return {
        success: true,
        message: `Here are the jobs paying over $${amount}k:

• Google - Frontend Developer ($120k-$150k)
• Microsoft - Full Stack Engineer ($130k-$160k) 
• Amazon - Software Development Engineer ($140k-$180k)
• Netflix - Senior Frontend Engineer ($170k-$200k)

You can see all details on your Kanban board or click any card for more information.`,
        data: {
          intent: 'query',
          entities: {
            salary: amount,
          },
        },
      };
    }

    return {
      success: true,
      message: `You currently have jobs in the following categories:

• Got Interview: 2 applications
• In Process: 1 application  
• Accepted: 1 application
• Rejected: 1 application

Use your Kanban board to see all details, or ask me something specific like "Show jobs paying over $100k"`,
      data: {
        intent: 'query',
      },
    };
  }

  private handleAddNoteIntent(message: string): ChatResponse {
    const noteMatch = message.match(/add\s+note\s+to\s+(\w+):\s*(.+)/i);
    
    if (noteMatch) {
      const company = noteMatch[1];
      const note = noteMatch[2];
      
      return {
        success: true,
        message: `✅ I've added the note "${note}" to your ${company} application. You can view and edit all notes in the job detail modal.`,
        data: {
          intent: 'add_note',
          entities: {
            company,
            note,
          },
        },
      };
    }

    return {
      success: true,
      message: 'Please specify the company and note. For example: "Add note to Google: great team culture"',
    };
  }

  private formatStatusName(status: string): string {
    switch (status) {
      case 'got_interview':
        return 'Got Interview';
      case 'in_process':
        return 'In Process';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  }
}

export const chatService = new ChatService();