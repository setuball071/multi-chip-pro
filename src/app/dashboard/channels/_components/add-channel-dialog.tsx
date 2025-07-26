
"use client";

import React, { useState, useEffect, useCallback } from 'react';
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
import { PlusCircle, Loader2, QrCode, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import QRCode from 'react-qr-code';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, onSnapshot, serverTimestamp } from "firebase/firestore";

type Step = 'initial' | 'connecting' | 'qr_scan' | 'success' | 'error';

export function AddChannelDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('initial');
  const [channelName, setChannelName] = useState('');
  const [qrString, setQrString] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [connectionId, setConnectionId] = useState<string | null>(null);

  // Simula a chamada para a Cloud Function 'initiateWhatsAppConnection'
  const initiateConnection = async () => {
    if (!channelName.trim()) {
      toast({ variant: 'destructive', title: 'Nome do canal é obrigatório.' });
      return;
    }
    
    setStep('connecting');

    try {
      console.log("Chamando a Cloud Function 'initiateWhatsAppConnection' com:", { channelName });
      // Em um app real, aqui estaria a chamada para a função:
      // const initiateFunction = httpsCallable(functions, 'initiateWhatsAppConnection');
      // const result = await initiateFunction({ channelName });
      // const newConnectionId = result.data.connectionId;

      // ---- SIMULAÇÃO ----
      // 1. Cria o documento no Firestore
      const connectionsCol = collection(db, "connections");
      const docRef = await addDoc(connectionsCol, {
        channelName: channelName,
        status: "PENDING_INSTANCE_START",
        createdAt: serverTimestamp()
      });
      const newConnectionId = docRef.id;

      // 2. Simula o tempo para o worker (Baileys) gerar o QR code
      setTimeout(() => {
        // O worker atualizaria o documento. Vamos simular essa atualização.
        const connectionDoc = doc(db, 'connections', newConnectionId);
        // Em um cenário real, você não faria isso no frontend.
        // Apenas para fins de teste.
         import('firebase/firestore').then(({ updateDoc }) => {
           updateDoc(connectionDoc, {
             status: "AWAITING_QR_SCAN",
             qr_string: `https://wa.me/15551234567?text=simulated-qr-${Date.now()}`
           });
         });
      }, 5000);
      // ---- FIM DA SIMULAÇÃO ----

      setConnectionId(newConnectionId);
    } catch (error) {
      console.error("Erro ao iniciar conexão:", error);
      setErrorMessage('Falha ao se comunicar com o servidor. Tente novamente.');
      setStep('error');
    }
  };

  useEffect(() => {
    if (!connectionId) return;

    // Listener para o documento da conexão
    const connectionDoc = doc(db, "connections", connectionId);
    const unsubscribe = onSnapshot(connectionDoc, (docSnap) => {
      const data = docSnap.data();
      if (!data) return;

      console.log("Status da conexão atualizado:", data.status);

      if (data.status === 'AWAITING_QR_SCAN' && data.qr_string) {
        setQrString(data.qr_string);
        setStep('qr_scan');
      } else if (data.status === 'CONNECTED') {
        setStep('success');
        unsubscribe(); // Para de ouvir após o sucesso
      } else if (data.status === 'ERROR' || data.status === 'TIMEOUT') {
        setErrorMessage(data.errorMessage || 'A conexão falhou ou expirou.');
        setStep('error');
        unsubscribe();
      }
    });

    return () => unsubscribe(); // Limpa o listener
  }, [connectionId]);


  const resetAndClose = useCallback(() => {
    setOpen(false);
  }, []);

  // Use um useEffect para fechar o modal após um delay no estado de sucesso/erro
  useEffect(() => {
    if (step === 'success') {
      toast({
        title: "Canal Conectado!",
        description: `O canal "${channelName}" foi conectado com sucesso.`,
        className: "bg-green-500 text-white",
      });
      const timer = setTimeout(resetAndClose, 1500);
      return () => clearTimeout(timer);
    }
    if (step === 'error') {
       const timer = setTimeout(resetAndClose, 4000);
       return () => clearTimeout(timer);
    }
  }, [step, resetAndClose, channelName, toast]);

   useEffect(() => {
    // Reset state when dialog is closed
    if (!open) {
      setTimeout(() => {
        setStep('initial');
        setChannelName('');
        setQrString('');
        setErrorMessage('');
        setConnectionId(null);
      }, 300); // Delay to allow animation
    }
  }, [open]);

  const renderContent = () => {
    switch (step) {
      case 'initial':
        return (
          <>
            <DialogDescription>
              Dê um nome para identificar esta conexão. Você escaneará um QR Code na próxima etapa.
            </DialogDescription>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="channelName">Nome do Canal</Label>
                <Input id="channelName" value={channelName} onChange={(e) => setChannelName(e.target.value)} placeholder="Ex: Vendas Time A" />
              </div>
              <Alert variant="destructive">
                <AlertTitle>Aviso Importante</AlertTitle>
                <AlertDescription>
                  Esta integração não é oficial e usa a automação do WhatsApp Web. Use por sua conta e risco.
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button onClick={initiateConnection} disabled={!channelName.trim()}>Conectar</Button>
            </DialogFooter>
          </>
        );
      case 'connecting':
        return (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
            <h3 className="font-semibold">Iniciando conexão, aguarde...</h3>
            <p className="text-sm text-muted-foreground">Estamos preparando o ambiente para gerar o QR Code.</p>
          </div>
        );
      case 'qr_scan':
        return (
          <div className="flex flex-col items-center justify-center text-center py-4">
             <DialogDescription className="mb-4">
              Abra o WhatsApp no seu celular, vá em Aparelhos Conectados e escaneie o código abaixo.
            </DialogDescription>
            <div className="bg-white p-4 rounded-lg border">
                {qrString ? <QRCode value={qrString} size={200} /> : <Skeleton className="h-[200px] w-[200px]" />}
            </div>
            <p className="text-sm text-muted-foreground mt-4">Aguardando escaneamento...</p>
          </div>
        );
       case 'success':
        return (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="font-semibold text-lg">Conexão Bem-sucedida!</h3>
            <p className="text-sm text-muted-foreground">Este modal será fechado automaticamente.</p>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <XCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="font-semibold text-lg">Falha na Conexão</h3>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Canal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Conectar Novo Canal WhatsApp</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

