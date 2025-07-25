
"use client"

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation, Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Send, Paperclip, Phone, MoreVertical, Tags, Pencil, Info, X, PanelRightClose, PanelRightOpen, MessageSquare, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';

interface ChatPanelProps {
  conversation: Conversation | null;
  isRightPanelOpen: boolean;
  setIsRightPanelOpen: (isOpen: boolean) => void;
}

const getScoreColor = (score: number) => {
  if (score >= 75) return 'text-green-500';
  if (score >= 50) return 'text-yellow-500';
  return 'text-red-500';
};

export default function ChatPanel({ conversation: initialConversation, isRightPanelOpen, setIsRightPanelOpen }: ChatPanelProps) {
  const [conversation, setConversation] = useState(initialConversation);
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
            author: 'Agente de Vendas', // Em um app real, viria do usuário logado
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
  const status = conversation.agent.healthProfile.status;
  const scoreColor = getScoreColor(score);


  return (
    <div className={cn("grid h-full bg-card", isRightPanelOpen ? "grid-cols-12" : "grid-cols-1")}>
      <div className={cn("flex flex-col", isRightPanelOpen ? "col-span-8" : "col-span-12")}>
        <CardHeader className="flex flex-row items-center justify-between border-b p-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                  <AvatarImage src={conversation.contact.avatarUrl} alt={conversation.contact.name} data-ai-hint="person avatar" />
                  <AvatarFallback>{conversation.contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                  <p className="font-semibold text-lg">{conversation.contact.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>📞 via {conversation.agent.internalName}</span>
                    <Separator orientation="vertical" className="h-3"/>
                     <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className={cn("flex items-center gap-1", scoreColor)}>
                                    <Star className="h-3 w-3" />
                                    <b>Score: {score}</b> ({status})
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Reputação do agente</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                  </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4"/></Button>
                 <Separator orientation="vertical" className="h-6 mx-2"/>
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}>
                                {isRightPanelOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
                            </Button>
                        </TooltipTrigger>
                         <TooltipContent>
                            <p>{isRightPanelOpen ? 'Ocultar painel' : 'Mostrar painel'}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </CardHeader>
        
        <ScrollArea className="flex-1 bg-muted/20">
            <div className="p-4 space-y-4">
            {conversation.messages.map((message, index) => {
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
            <Tabs defaultValue="message">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="message">Mensagem</TabsTrigger>
                    <TabsTrigger value="note">Nota Interna</TabsTrigger>
                </TabsList>
                <TabsContent value="message">
                    <div className="relative flex items-center w-full mt-2">
                        <Input placeholder="Digite uma mensagem... (/ para atalhos)" className="pr-20" />
                        <div className="absolute right-1 flex items-center">
                            <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5 text-muted-foreground"/></Button>
                            <Button size="sm"><Send className="h-4 w-4 mr-2" /> Enviar</Button>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="note">
                     <div className="relative flex items-center w-full mt-2">
                        <Textarea 
                            placeholder="Adicione uma nota interna para a equipe... (não será vista pelo contato)" 
                            id="internal-note-textarea"
                            className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50 pr-28"
                        />
                        <div className="absolute bottom-2 right-2">
                            <Button size="sm" onClick={() => {
                                const textarea = document.getElementById('internal-note-textarea') as HTMLTextAreaElement;
                                addInternalNote(textarea.value);
                                textarea.value = '';
                            }}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Adicionar Nota
                            </Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
      </div>
      {isRightPanelOpen && (
        <div className="col-span-4 border-l bg-background flex flex-col">
            <Card className="border-0 rounded-none shadow-none">
            <Tabs defaultValue="info">
                <CardHeader className="p-0 border-b">
                    <TabsList className="grid w-full grid-cols-2 rounded-none h-auto p-0 bg-transparent">
                        <TabsTrigger value="info" className="py-3 rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:shadow-none data-[state=active]:bg-muted/50">Informações</TabsTrigger>
                        <TabsTrigger value="tags" className="py-3 rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:shadow-none data-[state=active]:bg-muted/50">Tags</TabsTrigger>
                    </TabsList>
                </CardHeader>
                <TabsContent value="info">
                    <CardContent className="p-4 space-y-4 text-sm">
                         <div className="space-y-1">
                            <Label>Nome</Label>
                            <p className="text-muted-foreground">{conversation.contact.name}</p>
                         </div>
                         <div className="space-y-1">
                            <Label>Telefone</Label>
                            <p className="text-muted-foreground">{conversation.contact.phoneNumber}</p>
                         </div>
                    </CardContent>
                </TabsContent>
                <TabsContent value="tags">
                    <CardContent className="p-4 space-y-3">
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
                </TabsContent>
            </Tabs>
           </Card>
        </div>
      )}
    </div>
  );
}
