
"use client"

import React, { useState } from 'react';
import { mockConversations } from '@/lib/data';
import { Conversation } from '@/lib/types';
import ConversationList from './_components/conversation-list';
import ChatPanel from './_components/chat-panel';

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-120px)] border rounded-lg shadow-sm overflow-hidden">
      <div className="md:col-span-1">
        <ConversationList
          conversations={mockConversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
        />
      </div>
      <div className="md:col-span-2">
        <ChatPanel conversation={selectedConversation} />
      </div>
    </div>
  );
}
