"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Piloto } from "@/types";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const createColumns = (
  onEdit: (piloto: Piloto) => void,
  onDelete: (piloto: Piloto) => void
): ColumnDef<Piloto>[] => [
  {
    accessorKey: "idPiloto",
    header: "ID",
  },
  {
    accessorKey: "nombre",
    header: "Nombre Completo",
    cell: ({ row }) => {
      return `${row.original.nombres} ${row.original.telefono}`;
    },
  },
  {
    accessorKey: "telefono",
    header: "telefono",
  },
  {
    accessorKey: "email",
    header: "email",
  },
  {
    accessorKey: "licencia",
    header: "Licencia",
    cell: ({ row }) => {
      return `${row.original.numeroLicencia} ${row.original.tipoLicencia}`;
    },
  },
  {
    accessorKey: "fechaVencimientoLicencia",
    header: "Vencimiento",
    cell: ({ row }) => {
      return format(
        new Date(row.getValue("fechaVencimientoLicencia")),
        "dd/MM/yyyy",
        {
          locale: es,
        }
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const Piloto = row.original;

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
            <DropdownMenuItem onClick={() => onEdit(Piloto)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(Piloto)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
