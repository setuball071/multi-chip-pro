
"use client"

import React, { useState, useEffect } from 'react';
import { Conversation } from '@/lib/types';
import ConversationList from './_components/conversation-list';
import ChatPanel from './_components/chat-panel';
import { useAuth } from "reactfire";
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { mockConversations } from '@/lib/data';

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: user } = useAuth();

  useEffect(() => {
    // Não busca dados se o usuário não estiver autenticado.
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "conversations"), orderBy("lastMessage.timestamp", "desc")); 
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const convs: Conversation[] = [];
      querySnapshot.forEach((doc) => {
        convs.push({ id: doc.id, ...doc.data() } as Conversation);
      });
      
      if (convs.length > 0) {
        setConversations(convs);
        // Garante que uma conversa permaneça selecionada se ainda existir na nova lista.
        // Se a conversa selecionada anteriormente não existir mais, seleciona a primeira da nova lista.
        const currentSelectedId = selectedConversation?.id;
        if (currentSelectedId && convs.find(c => c.id === currentSelectedId)) {
          // Mantém a seleção atual
        } else {
          setSelectedConversation(convs[0]);
        }
      } else {
        // Se não houver conversas no Firestore, usa os dados de exemplo para teste.
        console.log("Nenhuma conversa no Firestore. Usando dados de exemplo.");
        setConversations(mockConversations);
        setSelectedConversation(mockConversations[0]);
      }
      
      setLoading(false);
    }, (error) => {
        console.error("Erro ao buscar conversas: ", error);
        // Em caso de erro, também usamos os dados de exemplo como fallback.
        setConversations(mockConversations);
        setSelectedConversation(mockConversations[0]);
        setLoading(false); 
    });

    // Limpa o listener quando o componente for desmontado ou o usuário mudar.
    return () => unsubscribe();
  }, [user]); // Depende do 'user' para re-executar se o usuário mudar. 
               // 'selectedConversation' foi removido para evitar loops desnecessários.


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
          key={selectedConversation?.id} // Chave garante que o painel seja remontado ao mudar de conversa.
        />
      </section>
    </div>
  );
}
