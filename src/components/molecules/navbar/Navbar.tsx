"use client";
import { LogOutIcon, MoreHorizontalIcon, SettingsIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Navbar() {
  const { logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const Logout = () => {
    logout();
    router.push("/");
  };

  // Verificar si estamos en la ruta /rutas
  const isRutasPage = pathname === "/workspace/rutas";

  return (
    <aside 
      className={`p-4 flex gap-4  items-center ${
        isRutasPage 
          ? "fixed top-0  right-0 z-[1000] shadow-2xs " 
          : "justify-between"
      }`}
    >
      <SidebarTrigger />
      
      <div className="flex gap-4 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="More Options">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <SettingsIcon />
                Configuraciones
              </DropdownMenuItem>
              <DropdownMenuItem onClick={Logout}>
                <LogOutIcon />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}