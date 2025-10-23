"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDataTable() {
  return (
    <div className="space-y-4 p-10">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-10 w-[150px] ml-auto" />
      </div>

      <div className="rounded-md border">
        <div className="p-4 space-y-3">
          <div className="flex gap-4">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 w-20" />
          </div>

          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-8 w-[100px]" />
      </div>
    </div>
  );
}