
"use client"

import React, { useState, useEffect } from 'react';
import { Conversation } from '@/lib/types';
import ConversationList from './_components/conversation-list';
import ChatPanel from './_components/chat-panel';
import { useAuth } from "reactfire";
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { mockConversations } from '@/lib/data';

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: user } = useAuth();

  useEffect(() => {
    if (!user) {
        return;
    }

    const q = query(collection(db, "conversations")); 
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const convs: Conversation[] = [];
      querySnapshot.forEach((doc) => {
        convs.push({ id: doc.id, ...doc.data() } as Conversation);
      });

      if (convs.length > 0) {
        setConversations(convs);
        if (!selectedConversation || !convs.find(c => c.id === selectedConversation.id)) {
          setSelectedConversation(convs[0]);
        }
      } else {
        // Se não houver conversas no Firestore, use os dados de exemplo.
        setConversations(mockConversations);
        setSelectedConversation(mockConversations[0]);
      }
      
      setLoading(false);
    }, (error) => {
        console.error("Erro ao buscar conversas: ", error);
        // Em caso de erro, também podemos usar os dados de exemplo como fallback.
        setConversations(mockConversations);
        setSelectedConversation(mockConversations[0]);
        setLoading(false); 
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
