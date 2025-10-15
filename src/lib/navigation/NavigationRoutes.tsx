import { BarChart3, ClipboardCheck, FileText, Home, MapPin, Package, Route, Settings, ShoppingCart, TrendingUp, UserCog, UserPlus, Users, Warehouse } from "lucide-react";
import { UserRole } from "./types";

export const navigationItems = [
  {
    title: "Home",
    icon: Home,
    url: "/workspace/dashboard",
    roles: ["admin", "manager", "user", "viewer"] as UserRole[],
  },
  {
    title: "Usuarios",
    icon: Users,
    roles: ["admin", "manager"] as UserRole[],
    items: [
      {
        title: "Lista de Usuarios",
        icon: Users,
        url: "/workspace/usuarios",
        roles: ["admin", "manager"] as UserRole[],
      },
      {
        title: "Crear Usuario",
        icon: UserPlus,
        url: "/workspace/usuarios/crear",
        roles: ["admin"] as UserRole[],
      },
      {
        title: "Roles y Permisos",
        icon: UserCog,
        url: "/workspace/usuarios/roles",
        roles: ["admin"] as UserRole[],
      },
    ],
  },
  {
    title: "Almacenes",
    icon: Warehouse,
    roles: ["admin", "manager", "user"] as UserRole[],
    items: [
      {
        title: "Lista de Almacenes",
        icon: Warehouse,
        url: "/workspace/almacenes",
        roles: ["admin", "manager", "user"] as UserRole[],
      },
      {
        title: "Inventario",
        icon: Package,
        url: "/workspace/almacenes/inventario",
        roles: ["admin", "manager", "user"] as UserRole[],
      },
      {
        title: "Movimientos",
        icon: TrendingUp,
        url: "/workspace/almacenes/movimientos",
        roles: ["admin", "manager"] as UserRole[],
      },
    ],
  },
  {
    title: "Rutas",
    icon: Route,
    roles: ["admin", "manager", "user"] as UserRole[],
    items: [
      {
        title: "Lista de Rutas",
        icon: Route,
        url: "/workspace/rutas",
        roles: ["admin", "manager", "user"] as UserRole[],
      },
      {
        title: "Planificación",
        icon: MapPin,
        url: "/workspace/rutas/planificacion",
        roles: ["admin", "manager"] as UserRole[],
      },
      {
        title: "Seguimiento",
        icon: TrendingUp,
        url: "/workspace/rutas/seguimiento",
        roles: ["admin", "manager", "user"] as UserRole[],
      },
    ],
  },
  {
    title: "Artículos",
    icon: Package,
    roles: ["admin", "manager", "user"] as UserRole[],
    items: [
      {
        title: "Catálogo",
        icon: Package,
        url: "/workspace/articulos",
        roles: ["admin", "manager", "user"] as UserRole[],
      },
      {
        title: "Crear Artículo",
        icon: ShoppingCart,
        url: "/workspace/articulos/crear",
        roles: ["admin", "manager"] as UserRole[],
      },
      {
        title: "Categorías",
        icon: FileText,
        url: "/workspace/articulos/categorias",
        roles: ["admin", "manager"] as UserRole[],
      },
    ],
  },
  {
    title: "Evaluo",
    icon: ClipboardCheck,
    roles: ["admin", "manager"] as UserRole[],
    items: [
      {
        title: "Evaluaciones",
        icon: ClipboardCheck,
        url: "/workspace/evaluo",
        roles: ["admin", "manager"] as UserRole[],
      },
      {
        title: "Reportes",
        icon: BarChart3,
        url: "/workspace/evaluo/reportes",
        roles: ["admin", "manager"] as UserRole[],
      },
      {
        title: "Métricas",
        icon: TrendingUp,
        url: "/workspace/evaluo/metricas",
        roles: ["admin"] as UserRole[],
      },
    ],
  },
  {
    title: "Configuraciones",
    icon: Settings,
    url: "/workspace/settings",
    roles: ["admin"] as UserRole[],
  },
]