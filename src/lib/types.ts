import { Timestamp } from "firebase/firestore";

export type HealthProfile = {
  score: number;
  total_sent_today: number;
  total_received_today: number;
  total_replies_to_our_messages: number;
  total_blocks_reported: number;
  session_start_count: number;
  status: 'warming' | 'active' | 'risky' | 'cooldown' | 'banned' | 'unknown';
  strategy: 'none' | 'slow' | 'moderate' | 'aggressive';
  last_calculation: Date | Timestamp;
  last_human_like_action: Date | Timestamp;
};

// Este tipo é usado tanto para Canais (connections) quanto para a estrutura legada de SIMs.
// Adapte conforme necessário.
export type SimCard = {
  id: string;
  internalName: string; // Vem de channelName no Firestore
  phoneNumber: string;
  status: 'active' | 'blocked' | 'warming up' | 'CONNECTED' | 'AWAITING_QR_SCAN' | 'PENDING_INSTANCE_START';
  tags: string[];
  messageCount: number;
  createdAt: Date | Timestamp;
  healthProfile: HealthProfile;
  qr_string?: string;
};

export type HistoryEntry = {
  id: string;
  simId: string;
  simName: string;
  type: 'warm-up' | 'broadcast';
  date: Date | Timestamp;
  details: string;
  tags: string[];
};

export type Contact = {
  id: string;
  name: string;
  phoneNumber: string;
  avatarUrl?: string;
  createdAt: Date | Timestamp;
  tags: string[];
  internalNote?: string;
  customFields?: Record<string, unknown>;
  isBlocked?: boolean;
  assignedTo?: string; // agentId
};

export type Message = {
  id: string;
  text: string;
  timestamp: Date | Timestamp;
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
