import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bot, MessageSquare, Smartphone, Clock, Info, BarChart3 } from "lucide-react";
import { mockHistory, mockSimCards } from "@/lib/data";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const totalSims = mockSimCards.length;
  const totalMessages = mockSimCards.reduce(
    (acc, sim) => acc + sim.messageCount,
    0
  );
  const warmUpSessions = mockHistory.filter(
    (h) => h.type === "warm-up"
  ).length;

  const sortedSims = [...mockSimCards].sort(
    (a, b) => b.messageCount - a.messageCount
  );
  
  const statusTranslations: {[key: string]: string} = {
    active: "Ativo",
    "warming up": "Aquecendo",
    blocked: "Bloqueado",
  }

  return (
    <div className="space-y-6">
       <Card className="bg-primary/90 text-primary-foreground border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Bem-vindo ao Multi-Chip Pro</CardTitle>
          <CardDescription className="text-primary-foreground/80">Fique por dentro das atividades de chat e do desempenho dos agentes.</CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversas Abertas</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">147</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversas Pendentes</CardTitle>
             <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">51</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversas com Bot</CardTitle>
             <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-headline">0</div>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duração Média Abertas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-baseline gap-2">
            <div className="text-2xl font-bold font-headline">2</div>
            <div className="text-sm text-muted-foreground">dias</div>
             <div className="text-2xl font-bold font-headline">4</div>
            <div className="text-sm text-muted-foreground">horas</div>
             <div className="text-2xl font-bold font-headline">22</div>
            <div className="text-sm text-muted-foreground">min</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duração Média Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-baseline gap-2">
            <div className="text-2xl font-bold font-headline">1</div>
            <div className="text-sm text-muted-foreground">dias</div>
             <div className="text-2xl font-bold font-headline">2</div>
            <div className="text-sm text-muted-foreground">horas</div>
             <div className="text-2xl font-bold font-headline">33</div>
            <div className="text-sm text-muted-foreground">min</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duração Média com Bot</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">N/D</div>
          </CardContent>
        </Card>
      </div>


      <div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Atividade dos Agentes</CardTitle>
            <CardDescription>
              Visão geral das mensagens enviadas por cartão SIM.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do SIM</TableHead>
                  <TableHead>Número de Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Mensagens Enviadas</TableHead>
                  <TableHead className="w-[150px]">Nível de Atividade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSims.slice(0, 5).map((sim) => (
                  <TableRow key={sim.id}>
                    <TableCell className="font-medium">{sim.internalName}</TableCell>
                    <TableCell>{sim.phoneNumber}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          sim.status === "active"
                            ? "default"
                            : sim.status === "warming up"
                            ? "secondary"
                            : "destructive"
                        }
                        className="capitalize"
                      >
                        {statusTranslations[sim.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">{sim.messageCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Progress value={(sim.messageCount / 4000) * 100} className="h-2"/>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
