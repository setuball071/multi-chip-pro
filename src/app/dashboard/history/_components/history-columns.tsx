"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Bot, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HistoryEntry } from "@/lib/types"

export const columns: ColumnDef<HistoryEntry>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const Icon = type === 'broadcast' ? Send : Bot;
      return (
        <Badge variant="outline" className="capitalize">
            <Icon className="mr-2 h-3 w-3" />
            {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "simName",
    header: "SIM Name",
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => {
      return <div className="max-w-xs truncate">{row.getValue("details")}</div>
    }
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return <div className="font-medium">{date.toLocaleString()}</div>;
    },
  },
    {
    accessorKey: "tags",
    header: "Tags",
     cell: ({ row }) => {
      const tags = row.getValue("tags") as string[];
      return (
        <div className="flex gap-1 flex-wrap">
          {tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
        </div>
      )
    },
  },
]
