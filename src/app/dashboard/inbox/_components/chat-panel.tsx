
"use client"

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Send, Paperclip, Phone, MoreVertical } from 'lucide-react';

interface ChatPanelProps {
  conversation: Conversation | null;
}

export default function ChatPanel({ conversation }: ChatPanelProps) {
  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center bg-card text-muted-foreground">
        <div className="text-center">
            <p className="text-lg font-medium">Selecione uma conversa</p>
            <p className="text-sm">Escolha uma conversa na lista para ver as mensagens.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={conversation.contact.avatarUrl} alt={conversation.contact.name} data-ai-hint="person avatar" />
            <AvatarFallback>{conversation.contact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{conversation.contact.name}</p>
            <p className="text-xs text-muted-foreground">Ativo via {conversation.agent.internalName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Phone /></Button>
            <Button variant="ghost" size="icon"><MoreVertical /></Button>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4 bg-muted/20">
        <div className="space-y-4">
          {conversation.messages.map((message) => {
             const isAgent = message.sender === 'agent';
             return (
                 <div key={message.id} className={cn("flex items-end gap-2", isAgent ? 'justify-end' : 'justify-start' )}>
                    {!isAgent && (
                         <Avatar className="h-8 w-8 border">
                            <AvatarImage src={conversation.contact.avatarUrl} alt={conversation.contact.name} data-ai-hint="person avatar" />
                            <AvatarFallback>{conversation.contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    )}
                    <div
                        className={cn(
                        'max-w-[75%] rounded-lg p-3 text-sm',
                        isAgent
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card'
                        )}
                    >
                        <p>{message.text}</p>
                    </div>
                 </div>
             )
          })}
        </div>
      </ScrollArea>

      <CardFooter className="p-4 border-t">
        <div className="relative w-full">
          <Input placeholder="Digite sua mensagem..." className="pr-24" />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
             <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5"/></Button>
            <Button><Send className="h-5 w-5" /></Button>
          </div>
        </div>
      </CardFooter>
    </div>
  );
}
