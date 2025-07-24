import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { mockSimCards } from '@/lib/data';
import { SimCardDataTable } from './_components/sim-card-data-table';
import { columns } from './_components/sim-card-columns';
import { AddSimDialog } from './_components/add-sim-dialog';

export default function SimManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-headline tracking-tight">SIM Inventory</h2>
            <p className="text-muted-foreground">Manage your registered SIM cards here.</p>
        </div>
        <AddSimDialog />
      </div>
      <SimCardDataTable columns={columns} data={mockSimCards} />
    </div>
  );
}
