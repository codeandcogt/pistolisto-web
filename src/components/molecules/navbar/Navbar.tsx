"use client";
import { LogOutIcon, MoreHorizontalIcon, SettingsIcon } from "lucide-react";

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

  const Logout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="p-4 flex gap-4 justify-between items-center">
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
