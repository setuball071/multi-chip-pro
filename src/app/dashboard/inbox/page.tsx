
"use client"

import React, { useState } from 'react';
import { mockConversations } from '@/lib/data';
import { Conversation } from '@/lib/types';
import ConversationList from './_components/conversation-list';
import ChatPanel from './_components/chat-panel';

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0]);

  return (
    <div className="grid grid-cols-12 h-[calc(100vh-100px)] border rounded-lg shadow-sm overflow-hidden">
      <div className="col-span-12 md:col-span-4 lg:col-span-3">
        <ConversationList
          conversations={mockConversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
        />
      </div>
      <div className="col-span-12 md:col-span-8 lg:col-span-9">
        <ChatPanel 
          conversation={selectedConversation} 
        />
      </div>
    </div>
  );
}
