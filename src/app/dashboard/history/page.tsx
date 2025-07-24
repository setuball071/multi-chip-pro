import React from 'react';
import { mockHistory } from '@/lib/data';
import { HistoryDataTable } from './_components/history-data-table';
import { columns } from './_components/history-columns';

export default function HistoryPage() {
  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl font-headline tracking-tight">Histórico de Atividades</h2>
        <p className="text-muted-foreground">Um registro completo de todos os aquecimentos e transmissões.</p>
      </div>
      <HistoryDataTable columns={columns} data={mockHistory} />
    </div>
  );
}
