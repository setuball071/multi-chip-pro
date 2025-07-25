export type SimCard = {
  id: string;
  internalName: string;
  phoneNumber: string;
  status: "active" | "blocked" | "warming up";
  tags: string[];
  messageCount: number;
  createdAt: Date;
};

export type HistoryEntry = {
  id: string;
  simId: string;
  simName: string;
  type: "warm-up" | "broadcast";
  date: Date;
  details: string;
  tags: string[];
};

export type Contact = {
  id: string;
  name: string;
  phoneNumber: string;
  avatarUrl?: string;
};

export type Message = {
  id: string;
  text: string;
  timestamp: Date;
  sender: "contact" | "agent";
  agentId: string;
};

export type Conversation = {
  id: string;
  contact: Contact;
  agent: SimCard;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
  status: "open" | "pending" | "closed";
};
