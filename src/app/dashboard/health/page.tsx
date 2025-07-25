import { mockSimCards } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, Send, CheckCircle, AlertTriangle, XCircle, PauseCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const getStatusInfo = (status: 'active' | 'warming' | 'risky' | 'cooldown' | 'banned') => {
  switch (status) {
    case 'active':
      return { text: 'Ativo', icon: CheckCircle, color: 'text-green-500' };
    case 'warming':
      return { text: 'Aquecendo', icon: TrendingUp, color: 'text-blue-500' };
    case 'risky':
      return { text: 'Em Risco', icon: AlertTriangle, color: 'text-yellow-500' };
    case 'cooldown':
      return { text: 'Em Pausa', icon: PauseCircle, color: 'text-orange-500' };
    case 'banned':
        return { text: 'Banido', icon: XCircle, color: 'text-red-700' };
    default:
      return { text: 'Desconhecido', icon: AlertTriangle, color: 'text-gray-500' };
  }
};

const getScoreColor = (score: number) => {
  if (score >= 75) return 'bg-green-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

const scoreChanges = [-2, 5, 0, -8, 1, 3, -1];

export default function HealthPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-headline tracking-tight">Saúde da Operação</h2>
        <p className="text-muted-foreground">Monitore a reputação e o score de cada agente em tempo real.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockSimCards.map((sim, index) => {
          const statusInfo = getStatusInfo(sim.healthProfile.status);
          const scoreChange = scoreChanges[index % scoreChanges.length];

          return (
            <Card key={sim.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="font-headline text-lg">{sim.internalName}</CardTitle>
                        <CardDescription className="flex items-center gap-1.5 pt-1">
                            <statusInfo.icon className={cn("h-4 w-4", statusInfo.color)} />
                            <span className={statusInfo.color}>{statusInfo.text}</span>
                        </CardDescription>
                    </div>
                     <div className="flex items-center gap-1.5 text-sm">
                        {scoreChange > 0 && <ArrowUp className="h-4 w-4 text-green-500" />}
                        {scoreChange < 0 && <ArrowDown className="h-4 w-4 text-red-500" />}
                        {scoreChange === 0 && <Minus className="h-4 w-4 text-muted-foreground" />}
                        <span className={cn(
                            scoreChange > 0 && 'text-green-500',
                            scoreChange < 0 && 'text-red-500',
                             'font-bold'
                        )}>{Math.abs(scoreChange)}</span>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Score de Reputação</span>
                    <span className="text-2xl font-bold font-headline">{sim.healthProfile.score}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className={cn('h-2.5 rounded-full transition-all', getScoreColor(sim.healthProfile.score))}
                      style={{ width: `${sim.healthProfile.score}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between items-center">
                       <span className="flex items-center gap-2"><Send className="h-4 w-4" /> Enviadas Hoje</span>
                       <span className="font-mono font-medium text-foreground">{sim.healthProfile.total_sent_today}</span>
                    </div>
                     <div className="flex justify-between items-center">
                       <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Recebidas Hoje</span>
                       <span className="font-mono font-medium text-foreground">{sim.healthProfile.total_received_today}</span>
                    </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
