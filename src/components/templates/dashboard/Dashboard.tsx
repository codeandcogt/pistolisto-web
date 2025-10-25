"use client";


import { AdminDashboard } from "@/components/organism/adminDashboard/AdminDashboard";
import { EvaluadorDashboard } from "@/components/organism/evaluadorDashboard/EvaluadorDashboard";
import { LogisticaDashboard } from "@/components/organism/logisticaDashboard/LogisticaDashboard";
import { Role } from "@/lib";

export function Dashboard({ role }: { role: number }) {
  
  switch (role) {
    case Role.ADMIN:
        return <AdminDashboard text="Administrativo"/>;

    case Role.SUPERVISOR:
        return <AdminDashboard text="Supervisor"/>;
    
    case Role.EVALUADOR:
      return <EvaluadorDashboard />;
    
    case Role.LOGISTICA:
      return <LogisticaDashboard />;
    
    case Role.PILOTO: 
    default:
      return (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Acceso No Autorizado</h2>
            <p className="text-muted-foreground">
              No tienes permisos para acceder a este panel
            </p>
          </div>
        </div>
      );
  }
}