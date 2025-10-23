"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Sucursal } from "@/types"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const createColumns = (
  onEdit: (data: Sucursal) => void,
  onDelete: (data: Sucursal) => void
): ColumnDef<Sucursal>[] => [
  {
    accessorKey: "id_rol",
    header: "ID",
  },
  {
    accessorKey: "nombre",
    header: "Nombre"
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const Sucursal = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(Sucursal)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => onDelete(Sucursal)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]