"use client"

import { ColumnDef } from "@tanstack/react-table"
import { RolPermiso } from "@/types"
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
  onEdit: (RolPermiso: RolPermiso) => void,
  onDelete: (RolPermiso: RolPermiso) => void
): ColumnDef<RolPermiso>[] => [
  {
    accessorKey: "id_rol_permiso",
    header: "ID",
  },
  {
    accessorKey: "id_rol",
    header: "Rol"
  },
  {
    accessorKey: "id_permiso",
    header: "Permiso",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const RolPermiso = row.original

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
            <DropdownMenuItem onClick={() => onEdit(RolPermiso)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => onDelete(RolPermiso)}
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