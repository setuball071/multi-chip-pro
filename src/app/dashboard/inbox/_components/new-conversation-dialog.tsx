
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Send, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockSimCards } from '@/lib/data'; // Usando dados de exemplo para os agentes

export function NewConversationDialog() {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Esta função simula a chamada a uma Cloud Function.
    const startNewConversation = async (data: { phoneNumber: string; agentId: string; message: string; }) => {
        console.log("Chamando a Cloud Function 'startNewConversation' com os dados:", data);
        // Em um aplicativo real, aqui estaria a chamada para a função:
        // const startFunction = httpsCallable(functions, 'startNewConversation');
        // await startFunction(data);

        // Simula uma espera de rede
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Para fins de teste, podemos simular uma falha ocasional.
        // if (Math.random() > 0.8) {
        //   throw new Error("Falha simulada no backend");
        // }

        console.log("Cloud Function executada com sucesso. O listener onSnapshot deve atualizar a UI.");
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries()) as { phoneNumber: string; agentId: string; message: string; };
        
        try {
            await startNewConversation(data);
            
            // Sucesso! Não fazemos nada na UI. O listener onSnapshot cuidará disso.
            // Apenas fechamos o modal e informamos o usuário.
            toast({
                title: "Solicitação Enviada",
                description: "A nova conversa aparecerá na lista em breve.",
            });
            setOpen(false);

        } catch (error) {
            console.error("Erro crítico ao iniciar conversa:", error);
            toast({
                variant: "destructive",
                title: "Falha ao Iniciar Conversa",
                description: "Não foi possível iniciar a conversa. Por favor, tente novamente.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
            <PlusCircle className="h-5 w-5" />
            <span className="sr-only">Nova Conversa</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
                <DialogTitle className="font-headline">Nova Conversa</DialogTitle>
                <DialogDescription>
                    Envie uma nova mensagem para iniciar uma conversa.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Número de Telefone</Label>
                    <Input id="phoneNumber" name="phoneNumber" placeholder="+55 (11) 98765-4321" required disabled={isSubmitting} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="agentId">Enviar com o Agente</Label>
                    <Select name="agentId" required disabled={isSubmitting}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um agente..." />
                        </SelectTrigger>
                        <SelectContent>
                        {mockSimCards.filter(sim => sim.status === 'active' || sim.status === 'warming up').map((sim) => (
                            <SelectItem key={sim.id} value={sim.id}>
                            {sim.internalName} ({sim.phoneNumber})
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea id="message" name="message" placeholder="Olá! Gostaria de falar sobre..." required disabled={isSubmitting}/>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary" disabled={isSubmitting}>
                        Cancelar
                    </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Enviar Mensagem
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
