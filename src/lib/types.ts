export type HealthProfile = {
  score: number;
  total_sent_today: number;
  total_received_today: number;
  total_replies_to_our_messages: number;
  total_blocks_reported: number;
  session_start_count: number;
  status: 'warming' | 'active' | 'risky' | 'cooldown' | 'banned';
  strategy: 'none' | 'slow' | 'moderate' | 'aggressive';
  last_calculation: Date;
  last_human_like_action: Date;
};

export type SimCard = {
  id: string;
  internalName: string;
  phoneNumber: string;
  status: 'active' | 'blocked' | 'warming up';
  tags: string[];
  messageCount: number;
  createdAt: Date;
  healthProfile: HealthProfile;
};

export type HistoryEntry = {
  id: string;
  simId: string;
  simName: string;
  type: 'warm-up' | 'broadcast';
  date: Date;
  details: string;
  tags: string[];
};

export type Contact = {
  id: string;
  name: string;
  phoneNumber: string;
  avatarUrl?: string;
  createdAt: Date;
  tags: string[];
  internalNote?: string;
  customFields?: Record<string, string>;
  isBlocked?: boolean;
  assignedTo?: string; // agentId
};

export type Message = {
  id: string;
  text: string;
  timestamp: Date;
  sender: 'contact' | 'agent' | 'system';
  agentId: string;
  type: 'message' | 'internal_note';
  author?: string; // Nome do agente que escreveu a nota
  status?: 'sending' | 'sent' | 'failed';
};

export type Conversation = {
  id: string;
  contact: Contact;
  agent: SimCard;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
  status: 'open' | 'pending' | 'closed';
};
