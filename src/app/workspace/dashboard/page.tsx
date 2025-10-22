"use client";

import { Admin } from '@/types';
// import { useAuthStore } from "@/store";
import Cookies from 'js-cookie';


export default function Dashboard() {
 const userCookie = Cookies.get('auth-admin');
  
  // Parsear el JSON string a objeto
  const user: Admin | null = userCookie ? JSON.parse(userCookie) : null;
  
  console.log(user, "valor cookies");
  console.log(user?.id_rol, "id_rol del usuario");
  return <div>page</div>;
}
