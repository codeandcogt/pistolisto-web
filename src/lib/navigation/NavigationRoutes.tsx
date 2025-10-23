import {
  BarChart3,
  ClipboardCheck,
  FileText,
  Home,
  MapPin,
  Package,
  Route,
  Settings,
  Shield,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  UserCog,
  Users,
  Warehouse,
} from "lucide-react";
import { Role } from "./types";

export const navigationItems = [
  {
    title: "Home",
    icon: Home,
    url: "/workspace/dashboard",
    roles: [
      Role.ADMIN,
      Role.SUPERVISOR,
      Role.EVALUADOR,
      Role.LOGISTICA,
      Role.PILOTO,
    ],
  },
  {
    title: "Usuarios",
    icon: Users,
    roles: [Role.ADMIN],
    items: [
      {
        title: "Usuarios",
        icon: Users,
        url: "/workspace/users",
        roles: [Role.ADMIN],
      },
      {
        title: "Permisos",
        icon: Shield,
        url: "/workspace/permissions",
        roles: [Role.ADMIN],
      },
      {
        title: "Roles",
        icon: UserCog,
        url: "/workspace/role",
        roles: [Role.ADMIN],
      },
      {
        title: "Permisos segun rol",
        icon: ShieldCheck,
        url: "/workspace/rolePermissions",
        roles: [Role.ADMIN],
      },
    ],
  },
  {
    title: "Almacenes",
    icon: Warehouse,
    roles: [Role.ADMIN, Role.SUPERVISOR, Role.LOGISTICA],
    items: [
      {
        title: "Lista de Almacenes",
        icon: Warehouse,
        url: "/workspace/almacenes",
        roles: [Role.ADMIN, Role.SUPERVISOR, Role.LOGISTICA],
      },
      {
        title: "Inventario",
        icon: Package,
        url: "/workspace/almacenes/inventario",
        roles: [Role.ADMIN, Role.SUPERVISOR, Role.LOGISTICA],
      },
      {
        title: "Movimientos",
        icon: TrendingUp,
        url: "/workspace/almacenes/movimientos",
        roles: [Role.ADMIN, Role.SUPERVISOR, Role.LOGISTICA],
      },
    ],
  },
  {
    title: "Rutas",
    icon: Route,
    roles: [Role.ADMIN, Role.LOGISTICA],
    items: [
      {
        title: "Lista de Rutas",
        icon: Route,
        url: "/workspace/rutas",
        roles: [Role.ADMIN, Role.LOGISTICA],
      },
      {
        title: "Planificación",
        icon: MapPin,
        url: "/workspace/rutas/planificacion",
        roles: [Role.ADMIN, Role.LOGISTICA],
      },
      {
        title: "Seguimiento",
        icon: TrendingUp,
        url: "/workspace/rutas/seguimiento",
        roles: [Role.ADMIN, Role.LOGISTICA],
      },
    ],
  },
  {
    title: "Artículos",
    icon: Package,
    roles: [Role.ADMIN, Role.SUPERVISOR, Role.EVALUADOR],
    items: [
      {
        title: "Catálogo",
        icon: Package,
        url: "/workspace/articulos",
        roles: [Role.ADMIN, Role.SUPERVISOR, Role.EVALUADOR],
      },
      {
        title: "Crear Artículo",
        icon: ShoppingCart,
        url: "/workspace/articulos/crear",
        roles: [Role.ADMIN, Role.SUPERVISOR, Role.EVALUADOR],
      },
      {
        title: "Categorías",
        icon: FileText,
        url: "/workspace/articulos/categorias",
        roles: [Role.ADMIN, Role.SUPERVISOR, Role.EVALUADOR],
      },
    ],
  },
  {
    title: "Evaluo",
    icon: ClipboardCheck,
    roles: [Role.ADMIN, Role.EVALUADOR],
    items: [
      {
        title: "Evaluaciones",
        icon: ClipboardCheck,
        url: "/workspace/evaluo",
        roles: [Role.ADMIN, Role.EVALUADOR],
      },
      {
        title: "Reportes",
        icon: BarChart3,
        url: "/workspace/evaluo/reportes",
        roles: [Role.ADMIN, Role.EVALUADOR],
      }
    ],
  },
  {
    title: "Configuraciones",
    icon: Settings,
    url: "/workspace/settings",
    roles: [Role.ADMIN, Role.SUPERVISOR],
  },
];
