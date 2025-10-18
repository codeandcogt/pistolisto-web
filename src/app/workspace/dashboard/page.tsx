"use client";

import { useAuthStore } from "@/store";


export default function Dashboard() {
  const {admin, token}= useAuthStore()
  console.log(admin, token, "valores")
  return <div>page</div>;
}
