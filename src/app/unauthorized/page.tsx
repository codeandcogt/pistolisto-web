'use client';

import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-black via-transparent to-green-900">
      <ShieldAlert color='#fff' className="w-20 h-20 text-destructive mb-6" />
      <h1 className="text-4xl font-bold mb-4 text-lime-300">Acceso Denegado</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        No tienes los permisos necesarios para acceder a esta página.
      </p>
      <Button
        onClick={() => router.push('/workspace/dashboard')}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
      >
        Volver al Dashboard
      </Button>
    </div>
  );
}