
"use client"

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation, Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Send, Paperclip, Phone, MoreVertical, Tags, Pencil, Info, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface ChatPanelProps {
  conversation: Conversation | null;
}

export default function ChatPanel({ conversation: initialConversation }: ChatPanelProps) {
  const [conversation, setConversation] = useState(initialConversation);
  const [newTag, setNewTag] = useState('');

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
            <p className="text-lg font-medium">Selecione uma conversa</p>
            <p className="text-sm">Escolha uma conversa na lista para ver as mensagens.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-full bg-card">
      <div className="md:col-span-2 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
            <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border">
                <AvatarImage src={conversation.contact.avatarUrl} alt={conversation.contact.name} data-ai-hint="person avatar" />
                <AvatarFallback>{conversation.contact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{conversation.contact.name}</p>
                <p className="text-xs text-muted-foreground">via {conversation.agent.internalName}</p>
            </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Phone /></Button>
                <Button variant="ghost" size="icon"><MoreVertical /></Button>
            </div>
        </CardHeader>
        
        <ScrollArea className="flex-1 bg-muted/20">
            <div className="p-4 space-y-4">
            {conversation.messages.map((message) => {
                const isAgent = message.sender === 'agent';
                const isInternalNote = message.type === 'internal_note';

                if (isInternalNote) {
                    return (
                        <div key={message.id} className="flex items-center gap-2 my-4">
                            <Separator className="flex-1" />
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Info className="h-4 w-4" />
                                <span>Nota de {message.author} em {new Date(message.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <Separator className="flex-1" />
                        </div>
                    )
                }

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
                             isInternalNote 
                                ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800'
                                : isAgent
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
                    <div className="flex items-center gap-2 w-full mt-2">
                        <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5"/></Button>
                        <Input placeholder="Digite uma mensagem... (/ para atalhos)" className="flex-1" />
                        <Button><Send className="h-5 w-5" /></Button>
                    </div>
                </TabsContent>
                <TabsContent value="note">
                    <div className="space-y-2 mt-2">
                        <Textarea 
                            placeholder="Adicione uma nota interna para a equipe... (não será vista pelo contato)" 
                            id="internal-note-textarea"
                            className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50"
                        />
                        <Button size="sm" onClick={() => {
                            const textarea = document.getElementById('internal-note-textarea') as HTMLTextAreaElement;
                            addInternalNote(textarea.value);
                            textarea.value = '';
                        }}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Adicionar Nota
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
      </div>
      <div className="md:col-span-1 border-l bg-card flex flex-col">
          <CardHeader className="border-b">
                <h3 className="font-semibold text-lg flex items-center gap-2"><Tags className="h-5 w-5" /> Tags da Conversa</h3>
          </CardHeader>
          <div className="p-4 space-y-3">
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
          </div>
          <Separator />
           <CardHeader>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Info className="h-5 w-5" /> Informações do Contato</h3>
          </CardHeader>
           <div className="p-4 space-y-2 text-sm">
              <p><strong>Nome:</strong> {conversation.contact.name}</p>
              <p><strong>Telefone:</strong> {conversation.contact.phoneNumber}</p>
           </div>

      </div>
    </div>
  );
}
