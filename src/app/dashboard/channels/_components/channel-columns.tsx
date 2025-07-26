
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { SimCard } from "@/lib/types" // Reutilizando o tipo, pois a estrutura é similar
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"


const statusConfig: {[key: string]: { text: string; className: string }} = {
  CONNECTED: { text: "Conectado", className: "bg-green-500 text-white" },
  AWAITING_QR_SCAN: { text: "Aguardando QR", className: "bg-yellow-500 text-black" },
  PENDING_INSTANCE_START: { text: "Iniciando", className: "bg-blue-500 text-white" },
  blocked: { text: "Bloqueado", className: "bg-red-700 text-white" },
  default: { text: "Desconhecido", className: "bg-gray-400 text-white" },
}


export const columns: ColumnDef<SimCard>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar tudo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "internalName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome do Canal
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Número de Telefone",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const config = statusConfig[status] || statusConfig.default;
      return (
        <Badge
          className={cn("capitalize border-transparent", config.className)}
        >
          {config.text}
        </Badge>
      );
    },
  },
  {
    accessorKey: "messageCount",
    header: ({ column }) => {
       return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-right w-full justify-end"
        >
          Mensagens
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("messageCount"))
      return <div className="text-right font-medium">{amount}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Data de Adição",
     cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const channel = row.original

      return (
        <div className="text-right">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(channel.phoneNumber)}
                    disabled={!channel.phoneNumber || channel.phoneNumber === 'N/A'}
                >
                Copiar Número
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Excluir Canal</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )
    },
  },
]
