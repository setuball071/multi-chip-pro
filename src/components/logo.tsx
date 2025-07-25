import type { SVGProps } from "react";
import { MessageCircle } from 'lucide-react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-2">
      <div className="p-2 bg-primary rounded-lg">
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
      </div>
      <h1 className="text-xl font-bold font-headline text-foreground">Multi-Chip pro</h1>
    </div>
  );
}
