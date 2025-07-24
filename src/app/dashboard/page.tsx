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
import { Bot, MessageSquare, Smartphone } from "lucide-react";
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
    active: "ativo",
    "warming up": "aquecendo",
    blocked: "bloqueado",
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de SIMs</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{totalSims} / 15</div>
            <p className="text-xs text-muted-foreground">
              Seus cartões SIM registrados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Mensagens Enviadas
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">
              {totalMessages.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Em todos os SIMs ativos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Execuções de Aquecimento</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{warmUpSessions}</div>
            <p className="text-xs text-muted-foreground">
              Total de sessões de simulação executadas
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Atividade dos SIMs</CardTitle>
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
