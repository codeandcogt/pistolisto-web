'use client';

import { Dashboard } from "@/components/templates/dashboard/Dashboard";
import { useAuthStore } from '@/store';

export default function DashboardPage() {
  const { admin } = useAuthStore();
    
  return (
    <div className="container mx-auto py-6 px-4">
      <Dashboard role={admin?.id_rol || 1} />
    </div>
  );
}