
"use client"

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Search, Users, Bot, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';


const getScoreBgColor = (score: number) => {
  if (score > 75) return 'bg-green-500';
  if (score > 49) return 'bg-yellow-500';
  return 'bg-red-500';
};

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  loading: boolean;
}

export default function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
  loading
}: ConversationListProps) {

   if (loading) {
    return (
      <div className="flex flex-col h-full bg-card border-r p-4 space-y-4">
        <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 10 }).map((_, i) => (
           <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (conversations.length === 0) {
      return (
         <div className="flex flex-col h-full bg-card border-r p-4">
            <div className="text-center text-muted-foreground flex-1 flex flex-col justify-center items-center">
                <MessageSquare className="h-10 w-10 mb-4" />
                <h3 className="font-semibold text-lg">Nenhuma Conversa</h3>
                <p className="text-sm">Não há conversas ativas na sua caixa de entrada.</p>
            </div>
        </div>
      )
  }


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
        {conversations.map((conv) => {
            const score = conv.agent.healthProfile.score;
            const scoreColor = getScoreBgColor(score);
            return (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className={cn(
                  'flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-muted/50 border-b border-border',
                  selectedConversation?.id === conv.id && 'bg-muted'
                )}
              >
                <div className="relative">
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage src={conv.contact.avatarUrl} alt={conv.contact.name} data-ai-hint="person avatar" />
                        <AvatarFallback>{conv.contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <div className={cn("absolute -bottom-1 -right-1 rounded-full h-3.5 w-3.5 border-2 border-card", scoreColor)} />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Saúde do Agente: {score} ({conv.agent.healthProfile.status})</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold truncate">{conv.contact.name}</p>
                    <p className="text-xs text-muted-foreground shrink-0">
                        {conv.lastMessage?.timestamp ? formatDistanceToNow(new Date(conv.lastMessage.timestamp), { addSuffix: true, locale: ptBR }) : ''}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.lastMessage?.sender === 'agent' ? 'Você: ' : ''}{conv.lastMessage?.text}
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
            )
        })}
      </ScrollArea>
    </div>
  );
}
