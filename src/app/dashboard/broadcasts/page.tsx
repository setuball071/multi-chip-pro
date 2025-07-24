"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, Clock, PlusCircle, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function BroadcastsPage() {
  const [variations, setVariations] = React.useState(['Oi!', 'Olá', 'E aí']);
  const [newVariation, setNewVariation] = React.useState('');

  const addVariation = () => {
    if (newVariation.trim()) {
      setVariations([...variations, newVariation.trim()]);
      setNewVariation('');
    }
  };

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };


  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl font-headline tracking-tight">Nova Transmissão</h2>
        <p className="text-muted-foreground">Agende uma nova campanha de mensagens em massa.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Conteúdo da Mensagem</CardTitle>
            <CardDescription>Defina a mensagem e suas variações para evitar filtros de spam.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <Label htmlFor="base-message">Mensagem Base (Opcional)</Label>
                <Textarea id="base-message" placeholder="ex: Espero que você esteja tendo um ótimo dia!" className="mt-1" />
                <p className="text-xs text-muted-foreground mt-1">Este texto pode ser incluído em todas as variações.</p>
            </div>
            <Separator />
            <div>
              <Label>Variações de Texto</Label>
              <p className="text-xs text-muted-foreground mb-2">Uma destas será escolhida aleatoriamente para cada mensagem.</p>
              <div className="space-y-2">
                {variations.map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input value={v} readOnly className="bg-muted/50" />
                    <Button variant="ghost" size="icon" onClick={() => removeVariation(i)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Input 
                  placeholder="Adicionar uma nova variação"
                  value={newVariation}
                  onChange={(e) => setNewVariation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addVariation()}
                 />
                <Button onClick={addVariation}><PlusCircle className="h-4 w-4 mr-2" /> Adicionar</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Agendamento e Entrega</CardTitle>
            <CardDescription>Configure como e quando sua mensagem será enviada.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label>Usar Todos os SIMs</Label>
                    <p className="text-xs text-muted-foreground">Transmitir de todos os SIMs ativos.</p>
                </div>
                <Switch defaultChecked />
            </div>
             <div className="space-y-2">
              <Label htmlFor="delay">Atraso Programável (segundos)</Label>
              <Input id="delay" type="number" defaultValue="5" />
              <p className="text-xs text-muted-foreground">Atraso entre mensagens de diferentes SIMs.</p>
            </div>
             <div className="space-y-2">
              <Label htmlFor="schedule">Horário Agendado (Opcional)</Label>
              <Input id="schedule" type="datetime-local" />
               <p className="text-xs text-muted-foreground">Deixe em branco para enviar imediatamente.</p>
            </div>
          </CardContent>
           <CardFooter>
            <Button className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Lançar Transmissão
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
