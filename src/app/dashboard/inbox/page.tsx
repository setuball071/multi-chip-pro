
"use client"

import React, { useState } from 'react';
import { mockConversations } from '@/lib/data';
import { Conversation } from '@/lib/types';
import ConversationList from './_components/conversation-list';
import ChatPanel from './_components/chat-panel';

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0]);

  return (
    <div className="flex h-[calc(100vh-120px)]">
      <div className="w-1/3 border-r">
        <ConversationList
          conversations={mockConversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
        />
      </div>
      <div className="w-2/3">
        <ChatPanel conversation={selectedConversation} />
      </div>
    </div>
  );
}
