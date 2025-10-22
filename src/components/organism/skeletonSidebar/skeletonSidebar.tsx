"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function SidebarSkeleton() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-2">
          <Skeleton className="h-12 w-full" />
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <div className="space-y-2 p-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <Skeleton className="h-12 w-full" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
