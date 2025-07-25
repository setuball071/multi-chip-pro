
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
import { PlusCircle, Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockSimCards } from '@/lib/data'; // Usando dados de exemplo para os agentes

export function NewConversationDialog() {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        
        // Em um aplicativo real, aqui você chamaria a Cloud Function 'startNewConversation'
        console.log("Iniciando nova conversa com:", data);
        
        toast({
            title: "Conversa Iniciada",
            description: `A mensagem foi enviada para ${data.phoneNumber}.`,
        });

        setOpen(false); // Fecha o diálogo após o envio
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
                    <Input id="phoneNumber" name="phoneNumber" placeholder="+55 (11) 98765-4321" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="agentId">Enviar com o Agente</Label>
                    <Select name="agentId" required>
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
                    <Textarea id="message" name="message" placeholder="Olá! Gostaria de falar sobre..." required />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancelar
                    </Button>
                </DialogClose>
                <Button type="submit">
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Mensagem
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
