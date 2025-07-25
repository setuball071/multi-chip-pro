
"use client"

import React, { useState, useEffect } from 'react';
import { Conversation } from '@/lib/types';
import ConversationList from './_components/conversation-list';
import ChatPanel from './_components/chat-panel';
import { useAuth } from "reactfire";
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: user } = useAuth();

  useEffect(() => {
    // Apenas busca as conversas se o usuário estiver autenticado.
    if (!user) {
        // Se ainda não tivermos um usuário, podemos continuar mostrando o estado de carregamento
        // ou um estado de login necessário, mas por enquanto, vamos manter o carregamento.
        return;
    }

    const q = query(collection(db, "conversations")); 
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const convs: Conversation[] = [];
      querySnapshot.forEach((doc) => {
        // CUIDADO: Isso precisa de um mapeamento cuidadoso do seu documento do Firestore para o tipo 'Conversation'
        // Este é um exemplo simplificado.
        convs.push({ id: doc.id, ...doc.data() } as Conversation);
      });
      setConversations(convs);
      
      // Se não houver conversa selecionada e houver conversas carregadas, selecione a primeira.
      // Se a conversa selecionada anteriormente foi removida, desmarque-a.
      if (!selectedConversation || !convs.find(c => c.id === selectedConversation.id)) {
        setSelectedConversation(convs.length > 0 ? convs[0] : null);
      }
      
      setLoading(false); // A mágica está aqui: para o carregamento após o primeiro fetch.
    }, (error) => {
        console.error("Erro ao buscar conversas: ", error);
        setLoading(false); // Para o carregamento em caso de erro também.
    });

    return () => unsubscribe();
  }, [user, selectedConversation]);


  return (
    <div className="grid grid-cols-12 h-[calc(100vh-100px)] border rounded-lg shadow-sm overflow-hidden">
      <aside className="col-span-12 md:col-span-4 lg:col-span-3">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          loading={loading}
        />
      </aside>
      <section className="col-span-12 md:col-span-8 lg:col-span-9">
        <ChatPanel 
          conversation={selectedConversation} 
          key={selectedConversation?.id}
        />
      </section>
    </div>
  );
}
