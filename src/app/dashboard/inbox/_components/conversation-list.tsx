
"use client"

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Search, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
}

export default function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
}: ConversationListProps) {
  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-headline flex items-center gap-2"><Users className="h-6 w-6" /> Caixa de Entrada</h2>
        <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar conversas..." className="pl-8" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelectConversation(conv)}
            className={cn(
              'flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-muted/50 border-b border-border',
              selectedConversation?.id === conv.id && 'bg-muted'
            )}
          >
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={conv.contact.avatarUrl} alt={conv.contact.name} data-ai-hint="person avatar" />
              <AvatarFallback>{conv.contact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="font-semibold truncate">{conv.contact.name}</p>
                <p className="text-xs text-muted-foreground shrink-0">
                    {formatDistanceToNow(conv.lastMessage.timestamp, { addSuffix: true, locale: ptBR })}
                </p>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {conv.lastMessage.sender === 'agent' ? 'Você: ' : ''}{conv.lastMessage.text}
              </p>
               <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="outline" className="text-xs">{conv.agent.internalName}</Badge>
               </div>
            </div>
            {conv.unreadCount > 0 && (
              <div className="flex flex-col items-center justify-center gap-1.5 self-center">
                 <Badge className="h-6 w-6 shrink-0 justify-center rounded-full bg-primary text-primary-foreground">
                    {conv.unreadCount}
                </Badge>
              </div>
            )}
          </button>
        ))}
      </ScrollArea>
    </div>
  );
}
