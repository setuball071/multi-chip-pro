
"use client"

import React, { useState } from 'react';
import { mockConversations } from '@/lib/data';
import { Conversation } from '@/lib/types';
import ConversationList from './_components/conversation-list';
import ChatPanel from './_components/chat-panel';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0]);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  return (
    <div className="relative">
      <div className="grid grid-cols-12 h-[calc(100vh-100px)] border rounded-lg shadow-sm overflow-hidden">
        <div className="col-span-3">
          <ConversationList
            conversations={mockConversations}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
          />
        </div>
        <div className={isRightPanelOpen ? "col-span-9" : "col-span-12"}>
          <ChatPanel 
            conversation={selectedConversation} 
            isRightPanelOpen={isRightPanelOpen}
            setIsRightPanelOpen={setIsRightPanelOpen}
          />
        </div>
      </div>
    </div>
  );
}
