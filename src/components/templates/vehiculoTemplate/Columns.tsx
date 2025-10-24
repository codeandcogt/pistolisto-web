"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Vehiculo } from "@/types";
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
  onEdit: (data: Vehiculo) => void,
  onDelete: (data: Vehiculo) => void
): ColumnDef<Vehiculo>[] => [
  {
    accessorKey: "idVehiculo",
    header: "ID",
  },
  {
    accessorKey: "modelo",
    header: "Modelo",
  },
  {
    accessorKey: "marca",
    header: "marca",
  },
  {
    accessorKey: "placa",
    header: "placa",
  },
  {
    accessorKey: "anio",
    header: "año",
  },
  {
    accessorKey: "tipo",
    header: "tipo",
  },
  {
    accessorKey: "capacidad",
    header: "capacidad",
  },
  {
    accessorKey: "capacidadPeso",
    header: "capacidadPeso",
  },
  {
    accessorKey: "kilometraje",
    header: "kilometraje",
  },
  {
    accessorKey: "fechaUltimoMantenimiento",
    header: "Ultimo Mantenimiento",
    cell: ({ row }) => {
      return format(
        new Date(row.getValue("fechaUltimoMantenimiento")),
        "dd/MM/yyyy",
        {
          locale: es,
        }
      );
    },
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const Vehiculo = row.original;

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
            <DropdownMenuItem onClick={() => onEdit(Vehiculo)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(Vehiculo)}
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
