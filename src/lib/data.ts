import type { SimCard, HistoryEntry, Conversation, Contact, Message } from "./types";

export const mockSimCards: SimCard[] = [
  {
    id: "sim-001",
    internalName: "Alfa Primário",
    phoneNumber: "+1 (555) 123-4567",
    status: "active",
    tags: ["vendas", "geração-de-leads"],
    messageCount: 254,
    createdAt: new Date("2023-10-01T10:00:00Z"),
    healthProfile: {
      score: 92,
      total_sent_today: 30,
      total_received_today: 28,
      total_replies_to_our_messages: 25,
      total_blocks_reported: 0,
      session_start_count: 5,
      status: "active",
      strategy: "moderate",
      last_calculation: new Date(),
      last_human_like_action: new Date(),
    }
  },
  {
    id: "sim-002",
    internalName: "Alfa de Backup",
    phoneNumber: "+1 (555) 234-5678",
    status: "warming up",
    tags: ["suporte"],
    messageCount: 42,
    createdAt: new Date("2023-11-15T14:30:00Z"),
    healthProfile: {
      score: 78,
      total_sent_today: 10,
      total_received_today: 9,
      total_replies_to_our_messages: 8,
      total_blocks_reported: 0,
      session_start_count: 1,
      status: "warming",
      strategy: "slow",
      last_calculation: new Date(),
      last_human_like_action: new Date(),
    }
  },
  {
    id: "sim-003",
    internalName: "Campanha Bravo",
    phoneNumber: "+1 (555) 345-6789",
    status: "active",
    tags: ["marketing", "promo-t1"],
    messageCount: 1052,
    createdAt: new Date("2023-09-05T09:00:00Z"),
     healthProfile: {
      score: 85,
      total_sent_today: 150,
      total_received_today: 130,
      total_replies_to_our_messages: 100,
      total_blocks_reported: 0,
      session_start_count: 20,
      status: "active",
      strategy: "aggressive",
      last_calculation: new Date(),
      last_human_like_action: new Date(),
    }
  },
  {
    id: "sim-004",
    internalName: "Teste de Dev",
    phoneNumber: "+1 (555) 456-7890",
    status: "blocked",
    tags: ["interno", "dev"],
    messageCount: 12,
    createdAt: new Date("2023-12-01T11:00:00Z"),
    healthProfile: {
      score: 15,
      total_sent_today: 12,
      total_received_today: 0,
      total_replies_to_our_messages: 0,
      total_blocks_reported: 1,
      session_start_count: 12,
      status: "banned",
      strategy: "none",
      last_calculation: new Date(),
      last_human_like_action: new Date(),
    }
  },
  {
    id: "sim-005",
    internalName: "Equipe de Suporte",
    phoneNumber: "+1 (555) 567-8901",
    status: "active",
    tags: ["suporte", "principal"],
    messageCount: 576,
    createdAt: new Date("2023-08-20T16:45:00Z"),
    healthProfile: {
      score: 65,
      total_sent_today: 80,
      total_received_today: 50,
      total_replies_to_our_messages: 45,
      total_blocks_reported: 0,
      session_start_count: 10,
      status: "risky",
      strategy: "moderate",
      last_calculation: new Date(),
      last_human_like_action: new Date(),
    }
  },
    {
    id: "sim-006",
    internalName: "Bravo Secundário",
    phoneNumber: "+1 (555) 678-9012",
    status: "warming up",
    tags: ["vendas", "teste"],
    messageCount: 88,
    createdAt: new Date("2024-01-10T12:00:00Z"),
    healthProfile: {
      score: 45,
      total_sent_today: 40,
      total_received_today: 15,
      total_replies_to_our_messages: 10,
      total_blocks_reported: 0,
      session_start_count: 30,
      status: "cooldown",
      strategy: "slow",
      last_calculation: new Date(),
      last_human_like_action: new Date(),
    }
  },
  {
    id: "sim-007",
    internalName: "Alto Volume",
    phoneNumber: "+1 (555) 789-0123",
    status: "active",
    tags: ["marketing", "notificações"],
    messageCount: 3421,
    createdAt: new Date("2023-07-01T08:00:00Z"),
     healthProfile: {
      score: 95,
      total_sent_today: 500,
      total_received_today: 480,
      total_replies_to_our_messages: 400,
      total_blocks_reported: 0,
      session_start_count: 50,
      status: "active",
      strategy: "aggressive",
      last_calculation: new Date(),
      last_human_like_action: new Date(),
    }
  },
];

export const mockHistory: HistoryEntry[] = [
    {
    id: "hist-001",
    simId: "sim-002",
    simName: "Alfa de Backup",
    type: "warm-up",
    date: new Date("2023-11-16T10:00:00Z"),
    details: 'Conversa simulada com "Campanha Bravo" (5 mensagens).',
    tags: ["suporte", "aquecimento"],
  },
  {
    id: "hist-002",
    simId: "sim-003",
    simName: "Campanha Bravo",
    type: "broadcast",
    date: new Date("2023-11-20T15:00:00Z"),
    details: "Enviada 'Promoção T1' para 500 contatos.",
    tags: ["marketing", "promo-t1"],
  },
  {
    id: "hist-003",
    simId: "sim-001",
    simName: "Alfa Primário",
    type: "broadcast",
    date: new Date("2023-11-21T11:30:00Z"),
    details: "Enviado 'Follow-up' para 30 contatos.",
    tags: ["vendas", "geração-de-leads"],
  },
  {
    id: "hist-004",
    simId: "sim-004",
    simName: "Teste de Dev",
    type: "warm-up",
    date: new Date("2023-12-02T14:00:00Z"),
    details: 'Conversa simulada com "Equipe de Suporte" (10 mensagens).',
    tags: ["interno", "dev", "aquecimento"],
  },
    {
    id: "hist-005",
    simId: "sim-006",
    simName: "Bravo Secundário",
    type: "warm-up",
    date: new Date("2024-01-11T09:00:00Z"),
    details: 'Conversa simulada com "Alto Volume" (20 mensagens).',
    tags: ["vendas", "teste", "aquecimento"],
  },
];


const contacts: Contact[] = [
  { 
    id: 'contact-1', 
    name: 'João Silva', 
    phoneNumber: '+55 11 99999-1111', 
    avatarUrl: 'https://placehold.co/100x100?text=JS',
    createdAt: new Date('2024-05-20T10:00:00Z'),
    tags: ['lead-quente', 'produto-x'],
    internalNote: 'Decisor na Empresa X. Acompanhar de perto.',
    customFields: { 'ID Externo': 'USR-12345', 'Plano': 'Premium' }
  },
  { 
    id: 'contact-2', 
    name: 'Maria Souza', 
    phoneNumber: '+55 21 98888-2222', 
    avatarUrl: 'https://placehold.co/100x100?text=MS',
    createdAt: new Date('2024-07-10T15:30:00Z'),
    tags: ['agendamento'],
    internalNote: 'Solicitou demonstração para a equipe de marketing.'
  },
  { 
    id: 'contact-3', 
    name: 'Pedro Costa', 
    phoneNumber: '+55 31 97777-3333',
    createdAt: new Date('2023-11-02T11:00:00Z'),
    tags: ['suporte', 'defeito'],
    customFields: { 'Nº do Pedido': 'BR-98765' }
  },
  { 
    id: 'contact-4', 
    name: 'Ana Pereira', 
    phoneNumber: '+55 41 96666-4444', 
    avatarUrl: 'https://placehold.co/100x100?text=AP',
    createdAt: new Date('2024-02-15T09:45:00Z'),
    tags: ['resolvido'],
    internalNote: 'Contato antigo. Voltou a ter interesse.'
  },
];

const generateMessages = (agentId: string): Message[] => [
  { id: 'msg-1', text: 'Olá! Tenho interesse no produto X. Pode me dar mais detalhes?', timestamp: new Date(new Date().getTime() - 10 * 60000), sender: 'contact', agentId, type: 'message' },
  { id: 'msg-2', text: 'Claro! O produto X tem as seguintes características...', timestamp: new Date(new Date().getTime() - 9 * 60000), sender: 'agent', agentId, type: 'message' },
  { id: 'msg-note-1', text: 'Cliente parece interessado no pacote premium. Oferecer desconto na próxima mensagem.', timestamp: new Date(new Date().getTime() - 8 * 60000), sender: 'system', agentId, type: 'internal_note', author: 'Agente de Vendas' },
  { id: 'msg-3', text: 'Qual o valor e as formas de pagamento?', timestamp: new Date(new Date().getTime() - 5 * 60000), sender: 'contact', agentId, type: 'message' },
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    contact: contacts[0],
    agent: mockSimCards[0],
    messages: generateMessages(mockSimCards[0].id),
    lastMessage: { id: 'msg-3a', text: 'Qual o valor e as formas de pagamento?', timestamp: new Date(new Date().getTime() - 5 * 60000), sender: 'contact', agentId: mockSimCards[0].id, type: 'message' },
    unreadCount: 1,
    status: 'open',
  },
  {
    id: 'conv-2',
    contact: contacts[1],
    agent: mockSimCards[0],
    messages: [
       { id: 'msg-4', text: 'Bom dia, gostaria de agendar uma demonstração.', timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60000), sender: 'contact', agentId: mockSimCards[0].id, type: 'message' },
       { id: 'msg-5', text: 'Olá, Maria! Podemos agendar para amanhã às 15h?', timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60000 + 300000), sender: 'agent', agentId: mockSimCards[0].id, type: 'message' }
    ],
    lastMessage: { id: 'msg-5a', text: 'Olá, Maria! Podemos agendar para amanhã às 15h?', timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60000 + 300000), sender: 'agent', agentId: mockSimCards[0].id, type: 'message' },
    unreadCount: 0,
    status: 'open',
  },
  {
    id: 'conv-3',
    contact: contacts[2],
    agent: mockSimCards[2],
    messages: [
      { id: 'msg-6', text: 'Recebi o produto, mas veio com defeito.', timestamp: new Date(new Date().getTime() - 30 * 60000), sender: 'contact', agentId: mockSimCards[2].id, type: 'message' },
    ],
    lastMessage: { id: 'msg-6a', text: 'Recebi o produto, mas veio com defeito.', timestamp: new Date(new Date().getTime() - 30 * 60000), sender: 'contact', agentId: mockSimCards[2].id, type: 'message' },
    unreadCount: 2,
    status: 'pending',
  },
    {
    id: 'conv-4',
    contact: contacts[3],
    agent: mockSimCards[4],
    messages: [
      { id: 'msg-7', text: 'Obrigado pelo suporte, problema resolvido!', timestamp: new Date(new Date().getTime() - 5 * 24 * 60 * 60000), sender: 'contact', agentId: mockSimCards[4].id, type: 'message' },
      { id: 'msg-8', text: 'Disponha! Qualquer coisa é só chamar.', timestamp: new Date(new Date().getTime() - 5 * 24 * 60 * 60000 + 60000), sender: 'agent', agentId: mockSimCards[4].id, type: 'message' }
    ],
    lastMessage: { id: 'msg-8a', text: 'Disponha! Qualquer coisa é só chamar.', timestamp: new Date(new Date().getTime() - 5 * 24 * 60 * 60000 + 60000), sender: 'agent', agentId: mockSimCards[4].id, type: 'message' },
    unreadCount: 0,
    status: 'closed',
  },
];
