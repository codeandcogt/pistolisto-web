"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Sucursal } from "@/types";
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

export const createColumns = (
  onEdit: (data: Sucursal) => void,
  onDelete: (data: Sucursal) => void
): ColumnDef<Sucursal>[] => [
  {
    accessorKey: "idSucursal",
    header: "ID",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
  },
  {
    accessorKey: "direccion",
    header: "Dirección",
  },
  {
    accessorKey: "codigo",
    header: "Codigo",
  },
  {
    accessorKey: "telefono",
    header: "Telefono",
  },
  {
    accessorKey: "horario",
    header: "Horario",
    cell: ({ row }) => {
      const formatTime = (timeString: string) => {
        let time = timeString;

        if (timeString.includes("T")) {
          time = timeString.split("T")[1].substring(0, 5);
        }

        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12; 

        return `${hour12.toString().padStart(2, "0")}:${minutes} ${ampm}`;
      };

      const apertura = formatTime(row.original.hora_apertura);
      const cierre = formatTime(row.original.hora_cierre);

      return `${apertura} - ${cierre}`;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const Sucursal = row.original;

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
      );
    },
  },
];
