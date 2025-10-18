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
import { ModeToggle } from "@/components/atom";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const Logout = () => {
    router.push("/");
    logout();
  };

  return (
    <aside className="fixed top-0 left-0 right-0 p-4 flex gap-4 justify-end ">
      <ModeToggle />
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
    </aside>
  );
}
