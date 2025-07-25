
"use client"

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation, Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Send, Paperclip, Phone, MoreVertical, Tags, Pencil, Info, X, PanelRightClose, PanelRightOpen, MessageSquare, Star, HeartPulse } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface ChatPanelProps {
  conversation: Conversation | null;
}

const getScoreColor = (score: number) => {
  if (score >= 75) return 'text-green-500 bg-green-500/10';
  if (score >= 50) return 'text-yellow-500 bg-yellow-500/10';
  return 'text-red-500 bg-red-500/10';
};

const getScoreBgColor = (score: number) => {
  if (score >= 75) return 'bg-green-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

export default function ChatPanel({ conversation: initialConversation }: ChatPanelProps) {
  const [conversation, setConversation] = useState(initialConversation);
  const [isContextPanelOpen, setIsContextPanelOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    setConversation(initialConversation);
  }, [initialConversation]);

  const addTag = () => {
    if (newTag && conversation && !conversation.tags.includes(newTag)) {
      setConversation({
        ...conversation,
        tags: [...conversation.tags, newTag]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (conversation) {
      setConversation({
        ...conversation,
        tags: conversation.tags.filter(tag => tag !== tagToRemove)
      });
    }
  };
  
    const addInternalNote = (noteText: string) => {
      if (conversation && noteText.trim()) {
        const newNote: Message = {
            id: `note-${Date.now()}`,
            text: noteText,
            timestamp: new Date(),
            sender: 'system',
            type: 'internal_note',
            agentId: conversation.agent.id,
            author: 'Agente de Vendas', 
        };
        setConversation({
            ...conversation,
            messages: [...conversation.messages, newNote],
        })
      }
  };


  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center bg-card text-muted-foreground">
        <div className="text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium mt-4">Selecione uma conversa</p>
            <p className="text-sm">Escolha uma conversa na lista para ver as mensagens.</p>
        </div>
      </div>
    );
  }
  
  const score = conversation.agent.healthProfile.score;
  const scoreColor = getScoreColor(score).replace('bg-green-500/10', '').replace('bg-yellow-500/10', '').replace('bg-red-500/10', '');


  return (
    <div className="flex flex-col h-full bg-card">
      <CardHeader 
        className="flex flex-row items-center justify-between border-b p-3 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsContextPanelOpen(true)}
      >
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
                <AvatarImage src={conversation.contact.avatarUrl} alt={conversation.contact.name} data-ai-hint="person avatar" />
                <AvatarFallback>{conversation.contact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold text-lg flex items-center gap-2">
                  {conversation.contact.name} 
                  <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                           <HeartPulse className={cn("h-4 w-4", scoreColor)} />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Score de Reputação: {score}</p>
                        </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </p>
                <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon"><Phone className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5"/></Button>
          </div>
      </CardHeader>
      
      <ScrollArea className="flex-1 bg-muted/20">
          <div className="p-4 space-y-4">
          {conversation.messages.map((message) => {
              const isAgent = message.sender === 'agent';
              const isInternalNote = message.type === 'internal_note';

              if (isInternalNote) {
                  return (
                      <div key={message.id} className="relative my-4">
                          <Separator />
                          <div className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-muted/20 px-2">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Pencil className="h-3 w-3" />
                                  <span>Nota de {message.author} • {isClient ? new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                              </div>
                          </div>
                      </div>
                  )
              }

              return (
                  <div key={message.id} className={cn("flex items-end gap-2", isAgent ? 'justify-end' : 'justify-start' )}>
                      {!isAgent && (
                          <Avatar className="h-8 w-8 border self-end">
                              <AvatarImage src={conversation.contact.avatarUrl} alt={conversation.contact.name} data-ai-hint="person avatar" />
                              <AvatarFallback>{conversation.contact.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                      )}
                      <div
                          className={cn(
                          'max-w-[75%] rounded-lg p-3 text-sm',
                           isAgent
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-card border'
                          )}
                      >
                          <p>{message.text}</p>
                      </div>
                  </div>
              )
          })}
          </div>
      </ScrollArea>

        <div className="p-4 border-t bg-background">
            <div className="relative flex items-center w-full mt-2">
                <Input placeholder="Digite uma mensagem..." className="pr-20" />
                <div className="absolute right-1 flex items-center">
                    <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5 text-muted-foreground"/></Button>
                    <Button size="sm"><Send className="h-4 w-4 mr-2" /> Enviar</Button>
                </div>
            </div>
        </div>

      <Sheet open={isContextPanelOpen} onOpenChange={setIsContextPanelOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] p-0">
          <SheetHeader className="p-6 border-b">
            <SheetTitle>Informações do Contato</SheetTitle>
            <SheetDescription>
              Detalhes, notas e tags para {conversation.contact.name}.
            </SheetDescription>
          </SheetHeader>
          <div className="p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardContent className="flex flex-col items-center text-center p-0">
                         <Avatar className="h-20 w-20 border-2 mb-4">
                            <AvatarImage src={conversation.contact.avatarUrl} alt={conversation.contact.name} data-ai-hint="person avatar" />
                            <AvatarFallback>{conversation.contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold">{conversation.contact.name}</h3>
                        <p className="text-muted-foreground">{conversation.contact.phoneNumber}</p>
                    </CardContent>
                </CardHeader>
            </Card>

             <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <HeartPulse className="h-5 w-5"/>
                    Saúde do Agente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Agente Ativo</span>
                            <span>{conversation.agent.internalName}</span>
                        </div>
                        <div className="space-y-1">
                          <Label>Score de Reputação: {score}</Label>
                          <Progress value={score} className={cn("h-2", getScoreBgColor(score))} />
                        </div>
                    </div>
                </CardContent>
              </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tags da Conversa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                      {conversation.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-sm">
                              {tag}
                              <button onClick={() => removeTag(tag)} className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5">
                                  <X className="h-3 w-3" />
                              </button>
                          </Badge>
                      ))}
                  </div>
                  <div className="flex items-center gap-2">
                      <Input 
                          placeholder="Adicionar tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addTag()}
                          className="flex-1"
                      />
                      <Button size="sm" onClick={addTag}>Adicionar</Button>
                  </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notas Internas</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea placeholder="Adicione uma nota persistente sobre este contato..." />
                <Button size="sm" className="mt-2">Salvar Nota</Button>
              </CardContent>
            </Card>

          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
