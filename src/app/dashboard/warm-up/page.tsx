"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bot, Loader2, MessageSquare, Send } from "lucide-react";
import { mockSimCards } from "@/lib/data";
import { simulateWarmUp } from "@/ai/flows/simulate-warm-up";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function WarmUpPage() {
  const [sim1, setSim1] = useState<string>("");
  const [sim2, setSim2] = useState<string>("");
  const [numMessages, setNumMessages] = useState<number>(10);
  const [conversationLog, setConversationLog] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSimulation = () => {
    if (!sim1 || !sim2) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione dois cartões SIM para iniciar a simulação.",
      });
      return;
    }
    if (sim1 === sim2) {
        toast({
            variant: "destructive",
            title: "Erro",
            description: "Por favor, selecione dois cartões SIM diferentes.",
        });
        return;
    }

    startTransition(async () => {
      setConversationLog([]);
      const sim1Name = mockSimCards.find((s) => s.id === sim1)?.internalName || "SIM 1";
      const sim2Name = mockSimCards.find((s) => s.id === sim2)?.internalName || "SIM 2";
      
      try {
        const result = await simulateWarmUp({
          sim1Name,
          sim2Name,
          numMessages,
        });
        setConversationLog(result.conversationLog);
        toast({
          title: "Simulação Concluída",
          description: `Gerada uma conversa entre ${sim1Name} e ${sim2Name}.`,
        });
      } catch (error) {
        console.error("Falha na simulação:", error);
        toast({
          variant: "destructive",
          title: "Falha na Simulação",
          description: "Não foi possível gerar a conversa. Por favor, tente novamente.",
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
         <div>
            <h2 className="text-2xl font-headline tracking-tight">Aquecimento com IA</h2>
            <p className="text-muted-foreground">Simule conversas para preparar seus SIMs.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Configuração da Simulação</CardTitle>
            <CardDescription>
              Selecione dois SIMs e o número de mensagens a serem trocadas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sim1">Primeiro SIM</Label>
              <Select value={sim1} onValueChange={setSim1}>
                <SelectTrigger id="sim1">
                  <SelectValue placeholder="Selecione um SIM" />
                </SelectTrigger>
                <SelectContent>
                  {mockSimCards.map((sim) => (
                    <SelectItem key={sim.id} value={sim.id}>
                      {sim.internalName} ({sim.phoneNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sim2">Segundo SIM</Label>
              <Select value={sim2} onValueChange={setSim2}>
                <SelectTrigger id="sim2">
                  <SelectValue placeholder="Selecione um SIM" />
                </SelectTrigger>
                <SelectContent>
                  {mockSimCards.map((sim) => (
                    <SelectItem key={sim.id} value={sim.id}>
                      {sim.internalName} ({sim.phoneNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="numMessages">Número de Mensagens</Label>
              <Input
                id="numMessages"
                type="number"
                value={numMessages}
                onChange={(e) => setNumMessages(parseInt(e.target.value, 10))}
                min="2"
                max="50"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSimulation} disabled={isPending} className="w-full">
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Bot className="mr-2 h-4 w-4" />
              )}
              Iniciar Simulação
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="font-headline">Registro da Conversa</CardTitle>
            <CardDescription>
              A conversa gerada aparecerá aqui.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] w-full rounded-md border bg-muted/50 p-4">
              {isPending && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <p className="font-medium">Gerando conversa...</p>
                    <p className="text-sm">Isso pode levar um momento.</p>
                </div>
              )}
              {!isPending && conversationLog.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mb-4" />
                  <p className="font-semibold text-lg">Pronto para Simular</p>
                  <p className="text-sm text-center">
                    Configure sua simulação à esquerda e clique em "Iniciar" para começar.
                  </p>
                </div>
              )}
              <div className="space-y-4">
                {conversationLog.map((line, index) => {
                  const [speaker, ...messageParts] = line.split(":");
                  const message = messageParts.join(":");
                  const isSim1 = speaker === (mockSimCards.find(s => s.id === sim1)?.internalName || "SIM 1");

                  return (
                    <div
                      key={index}
                      className={`flex items-end gap-2 ${ isSim1 ? "justify-start" : "justify-end"}`}
                    >
                      <div className={`max-w-[75%] rounded-lg p-3 ${
                        isSim1
                            ? "bg-card text-card-foreground border"
                            : "bg-primary text-primary-foreground"
                      }`}>
                        <p className="text-sm">{message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
