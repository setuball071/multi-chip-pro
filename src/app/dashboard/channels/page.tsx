
"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { SimCard } from '@/lib/types';
import { columns } from './_components/channel-columns';
import { ChannelDataTable } from './_components/channel-data-table';
import { AddChannelDialog } from './_components/add-channel-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from 'reactfire';

export default function ChannelManagementPage() {
  const [channels, setChannels] = useState<SimCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: user } = useAuth();


  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    };
    // Em um app real, você filtraria por workspaceId, etc.
    const q = query(collection(db, "connections"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedChannels: SimCard[] = [];
      querySnapshot.forEach((doc) => {
        // Mapeia os dados do Firestore para o tipo SimCard
        const data = doc.data();
        fetchedChannels.push({
          id: doc.id,
          internalName: data.channelName,
          phoneNumber: data.phoneNumber || 'N/A',
          status: data.status,
          tags: data.tags || [],
          messageCount: data.messageCount || 0,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          healthProfile: data.healthProfile || { score: 0, status: 'unknown' },
        } as SimCard);
      });
      setChannels(fetchedChannels);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar canais:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-headline tracking-tight">Gerenciamento de Canais</h2>
            <p className="text-muted-foreground">Gerencie suas conexões do WhatsApp aqui.</p>
        </div>
        <AddChannelDialog />
      </div>
      {loading ? (
        <div className="rounded-md border">
          <div className="p-4">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="p-4 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      ) : (
        <ChannelDataTable columns={columns} data={channels} />
      )}
    </div>
  );
}
