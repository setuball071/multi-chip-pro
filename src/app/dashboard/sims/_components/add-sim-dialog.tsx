"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function AddSimDialog() {
    const { toast } = useToast();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Em um aplicativo real, você lidaria com o envio do formulário aqui
        toast({
            title: "SIM Registrado",
            description: "O novo cartão SIM foi adicionado ao seu inventário.",
        });
        // Aqui você normalmente fecharia o diálogo, o que precisa de gerenciamento de estado.
        // Para este exemplo, apenas mostramos um brinde.
    };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar SIM
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle className="font-headline">Registrar Novo SIM</DialogTitle>
            <DialogDescription>
                Adicione um novo cartão SIM ao seu inventário. Clique em salvar quando terminar.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                Nome Interno
                </Label>
                <Input id="name" defaultValue="Campanha Charlie" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                Número de Telefone
                </Label>
                <Input id="phone" defaultValue="+55 (11) 98765-4321" className="col-span-3" />
            </div>
            </div>
            <DialogFooter>
            <Button type="submit">Salvar SIM</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
