"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
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
  onEdit: (user: User) => void,
  onDelete: (user: User) => void
): ColumnDef<User>[] => [
  {
    accessorKey: "id_administrativo",
    header: "ID",
  },
  {
    accessorKey: "nombre",
    header: "Nombre Completo",
    cell: ({ row }) => {
      return `${row.original.nombre} ${row.original.apellido}`
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "nombre_usuario",
    header: "Usuario",
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
  },
  {
    accessorKey: "cui",
    header: "CUI",
  },
  {
    accessorKey: "genero",
    header: "Género",
  },
  {
    accessorKey: "fecha_nacimiento",
    header: "Fecha Nacimiento",
    cell: ({ row }) => {
      return format(new Date(row.getValue("fecha_nacimiento")), "dd/MM/yyyy", {
        locale: es,
      })
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("estado") as boolean
      return (
        <Badge variant={estado ? "default" : "destructive"}>
          {estado ? "Activo" : "Inactivo"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "primer_login",
    header: "Primer Login",
    cell: ({ row }) => {
      return row.getValue("primer_login") ? "Sí" : "No"
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.email)}
            >
              Copiar email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => onDelete(user)}
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