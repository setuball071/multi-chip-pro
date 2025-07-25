
"use client"

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation, Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Send, Paperclip, Phone, MoreVertical, Tags, Pencil, Info, X, PanelRightClose, PanelRightOpen, MessageSquare, Star, HeartPulse, Download, Mail, PlusCircle, Copy, ShieldBan, Search, Bell, Clock } from 'lucide-react';
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
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


interface ChatPanelProps {
  conversation: Conversation | null;
}

const getScoreColor = (score: number) => {
  if (score >= 75) return 'text-green-500';
  if (score >= 50) return 'text-yellow-500';
  return 'text-red-500';
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
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    setConversation(initialConversation);
     if (initialConversation) {
      setIsContextPanelOpen(false);
    }
  }, [initialConversation]);

  const addTag = () => {
    if (newTag && conversation && !conversation.contact.tags.includes(newTag)) {
       const updatedContact = {
        ...conversation.contact,
        tags: [...conversation.contact.tags, newTag]
      };
      setConversation({
        ...conversation,
        contact: updatedContact,
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (conversation) {
       const updatedContact = {
        ...conversation.contact,
        tags: conversation.contact.tags.filter(tag => tag !== tagToRemove)
      };
      setConversation({
        ...conversation,
        contact: updatedContact
      });
    }
  };

  const copyToClipboard = () => {
      if (conversation) {
          navigator.clipboard.writeText(conversation.contact.phoneNumber);
          toast({
              title: "Copiado!",
              description: "O número de telefone foi copiado para a área de transferência.",
          });
      }
  }

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center bg-muted/30 text-muted-foreground">
        <div className="text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium mt-4">Selecione uma conversa</p>
            <p className="text-sm">Escolha uma conversa na lista para ver as mensagens.</p>
        </div>
      </div>
    );
  }
  
  const score = conversation.agent.healthProfile.score;
  const scoreColor = getScoreColor(score);
  const contactCreationDate = isClient ? formatDistanceToNow(new Date(conversation.contact.createdAt), { addSuffix: true, locale: ptBR }) : '';


  return (
    <div className="flex flex-col h-full bg-card">
      <header 
        className="flex items-center justify-between border-b p-3 shrink-0"
      >
          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors rounded-md p-1 -m-1"
            onClick={() => setIsContextPanelOpen(true)}
           >
            <Avatar className="h-10 w-10 border">
                <AvatarImage src={conversation.contact.avatarUrl} alt={conversation.contact.name} data-ai-hint="person avatar" />
                <AvatarFallback>{conversation.contact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
                <p className="font-semibold text-lg">{conversation.contact.name}</p>
                <div className={cn("h-2.5 w-2.5 rounded-full", getScoreBgColor(score))}></div>
            </div>
          </div>
          <div className="flex items-center gap-1">
              <TooltipProvider>
                  <Tooltip>
                      <TooltipTrigger asChild>
                           <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon"><Tags className="h-5 w-5"/></Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="grid gap-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium leading-none">Tags da Conversa</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Adicione ou remova tags para organizar.
                                    </p>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                      {conversation.contact.tags.map(tag => (
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
                                          placeholder="Adicionar nova tag..."
                                          value={newTag}
                                          onChange={(e) => setNewTag(e.target.value)}
                                          onKeyDown={(e) => e.key === 'Enter' && addTag()}
                                          className="flex-1"
                                      />
                                      <Button size="sm" onClick={addTag}><PlusCircle className="h-4 w-4" /></Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                      </TooltipTrigger>
                      <TooltipContent>Gerenciar Tags</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon"><Bell className="h-5 w-5"/></Button>
                      </TooltipTrigger>
                      <TooltipContent>Criar Lembrete</TooltipContent>
                  </Tooltip>
                   <Tooltip>
                      <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon"><Search className="h-5 w-5"/></Button>
                      </TooltipTrigger>
                      <TooltipContent>Pesquisar na Conversa</TooltipContent>
                  </Tooltip>
              </TooltipProvider>
          </div>
      </header>
      
      <main className="flex-1 bg-muted/20 overflow-y-auto">
          <ScrollArea className="h-full">
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
      </main>

      <footer className="p-4 border-t bg-background shrink-0">
          <div className="relative flex items-center w-full">
              <Input placeholder="Digite uma mensagem..." className="pr-20" />
              <div className="absolute right-1 flex items-center">
                  <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5 text-muted-foreground"/></Button>
                  <Button size="sm"><Send className="h-4 w-4 mr-2" /> Enviar</Button>
              </div>
          </div>
      </footer>

      <Sheet open={isContextPanelOpen} onOpenChange={setIsContextPanelOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] p-0 flex flex-col">
          <SheetHeader className="p-6 border-b">
            <SheetTitle>Informações do Contato</SheetTitle>
            <SheetDescription>
              Detalhes, notas e tags para {conversation.contact.name}.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
                <Card>
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                         <Avatar className="h-20 w-20 border-2 mb-4">
                            <AvatarImage src={conversation.contact.avatarUrl} alt={conversation.contact.name} data-ai-hint="person avatar" />
                            <AvatarFallback>{conversation.contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold">{conversation.contact.name}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span>{conversation.contact.phoneNumber}</span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyToClipboard}>
                                            <Copy className="h-4 w-4"/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Copiar número</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Ativo desde {contactCreationDate}</p>
                    </CardContent>
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
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm text-muted-foreground">Score de Reputação</span>
                                <span className={cn("font-bold text-xl", scoreColor)}>{score}</span>
                            </div>
                            <Progress value={score} className={cn("h-2 [&>*]:bg-green-500", score < 75 && "[&>*]:bg-yellow-500", score < 50 && "[&>*]:bg-red-500")} />
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs text-muted-foreground">Agente: {conversation.agent.internalName}</span>
                                <span className="text-xs text-muted-foreground capitalize">{conversation.agent.healthProfile.status}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center justify-between">
                            <span>Nota de Contato</span>
                            <Button variant="ghost" size="sm">Salvar</Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea 
                            placeholder="Adicione uma nota persistente sobre este contato..."
                            className="min-h-[100px]"
                            defaultValue={conversation.contact.internalNote}
                        />
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center justify-between">
                            <span>Campos Personalizados</span>
                            <Button variant="ghost" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Adicionar</Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {conversation.contact.customFields && Object.entries(conversation.contact.customFields).map(([key, value]) => (
                            <div key={key} className="text-sm">
                                <Label className="font-semibold capitalize">{key}</Label>
                                <p className="text-muted-foreground">{value}</p>
                            </div>
                        ))}
                         {!conversation.contact.customFields || Object.keys(conversation.contact.customFields).length === 0 && (
                            <p className="text-sm text-muted-foreground">Nenhum campo personalizado.</p>
                        )}
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Ações</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-2">
                        <Button variant="outline"><Mail className="mr-2 h-4 w-4"/> Enviar Transcrição por E-mail</Button>
                        <Button variant="outline"><Download className="mr-2 h-4 w-4"/> Baixar Transcrição</Button>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full mt-2">
                                    <ShieldBan className="mr-2 h-4 w-4"/>
                                    Bloquear Contato
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. Isso bloqueará permanentemente o contato de enviar mensagens para este número.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction className={cn(buttonVariants({variant: "destructive"}))}>
                                    Sim, bloquear contato
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </CardContent>
                </Card>

            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
