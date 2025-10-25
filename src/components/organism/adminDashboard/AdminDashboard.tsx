import { useAlmacen } from "@/hooks/useAlmacen/useAlmacen";
import { useArticulo } from "@/hooks/useArticulo/useArticulo";
import { usePiloto } from "@/hooks/usePiloto/usePiloto";
import { useSucursal } from "@/hooks/useSucursal/useSucursal";
import { useVehiculo } from "@/hooks/useVehiculo/useVehiculo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Warehouse, 
  Users, 
  Truck, 
  Store,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Activity
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function AdminDashboard({text}:{text: string}) {
  const { almacenes } = useAlmacen();
  const { articulos } = useArticulo();
  const { pilotos } = usePiloto();
  const { vehiculos } = useVehiculo();
  const { sucursales } = useSucursal();

  // Calcular estadísticas
  const stats = {
    totalSucursales: sucursales?.length || 0,
    sucursalesActivas: sucursales?.filter(s => s.estado)?.length || 0,
    totalAlmacenes: almacenes?.length || 0,
    almacenesActivos: almacenes?.filter(a => a.estado)?.length || 0,
    totalArticulos: articulos?.length || 0,
    articulosActivos: articulos?.filter(a => a.estado)?.length || 0,
    totalPilotos: pilotos?.length || 0,
    pilotosActivos: pilotos?.filter(p => p.estado)?.length || 0,
    totalVehiculos: vehiculos?.length || 0,
    vehiculosActivos: vehiculos?.filter(v => v.estado)?.length || 0,
  };

  // Calcular capacidad total de almacenes
  const capacidadTotal = almacenes?.reduce((acc, alm) => acc + (alm.capacidad_maxima || 0), 0) || 0;

  // Vehículos que necesitan mantenimiento
  const vehiculosMantenimiento = vehiculos?.filter(v => {
    if (!v.fechaUltimoMantenimiento) return false;
    const ultimoMantenimiento = new Date(v.fechaUltimoMantenimiento);
    const hoy = new Date();
    const diffDias = Math.floor((hoy.getTime() - ultimoMantenimiento.getTime()) / (1000 * 60 * 60 * 24));
    return diffDias > 60;
  })?.length || 0;

  const cards = [
    {
      title: "Sucursales",
      total: stats.totalSucursales,
      active: stats.sucursalesActivas,
      icon: Store,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Almacenes",
      total: stats.totalAlmacenes,
      active: stats.almacenesActivos,
      icon: Warehouse,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      extra: `${capacidadTotal.toLocaleString()} unidades`
    },
    {
      title: "Artículos",
      total: stats.totalArticulos,
      active: stats.articulosActivos,
      icon: Package,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Pilotos",
      total: stats.totalPilotos,
      active: stats.pilotosActivos,
      icon: Users,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Vehículos",
      total: stats.totalVehiculos,
      active: stats.vehiculosActivos,
      icon: Truck,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      alert: vehiculosMantenimiento
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard {text}</h1>
          <p className="text-muted-foreground mt-1">Resumen general del sistema de gestión</p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Activity className="w-3 h-3" />
          En vivo
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const activePercentage = card.total > 0 ? (card.active / card.total) * 100 : 0;
          
          return (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`${card.bgColor} p-2 rounded-md`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold">{card.total}</div>
                    <span className="text-xs text-muted-foreground">total</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Activos</span>
                      <span className="font-medium">{card.active} ({activePercentage.toFixed(0)}%)</span>
                    </div>
                    <Progress value={activePercentage} className="h-1" />
                  </div>

                  {card.extra && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Capacidad: {card.extra}</span>
                    </div>
                  )}

                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Distribution Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Distribución de Almacenes */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Almacenes</CardTitle>
            <CardDescription>Por tipo de almacenamiento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {almacenes && Array.from(new Set(almacenes.map(a => a.tipo_almacen))).map((tipo, idx) => {
              const cantidad = almacenes.filter(a => a.tipo_almacen === tipo).length;
              const porcentaje = ((cantidad / stats.totalAlmacenes) * 100).toFixed(1);
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-sm font-medium capitalize">{tipo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{cantidad}</span>
                      <Badge variant="secondary" className="text-xs">
                        {porcentaje}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={parseFloat(porcentaje)} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Flota de Vehículos */}
        <Card>
          <CardHeader>
            <CardTitle>Flota de Vehículos</CardTitle>
            <CardDescription>Distribución por tipo de vehículo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {vehiculos && Array.from(new Set(vehiculos.map(v => v.tipo))).map((tipo, idx) => {
              const cantidad = vehiculos.filter(v => v.tipo === tipo).length;
              const porcentaje = ((cantidad / stats.totalVehiculos) * 100).toFixed(1);
              const capacidadTotal = vehiculos
                .filter(v => v.tipo === tipo)
                .reduce((acc, v) => acc + v.capacidad, 0);
              
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div>
                        <span className="text-sm font-medium capitalize block">{tipo}</span>
                        <span className="text-xs text-muted-foreground">
                          Cap. total: {capacidadTotal} unidades
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{cantidad}</span>
                      <Badge variant="secondary" className="text-xs">
                        {porcentaje}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={parseFloat(porcentaje)} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Estado General */}
      <Card>
        <CardHeader>
          <CardTitle>Estado General del Sistema</CardTitle>
          <CardDescription>Resumen de recursos activos vs totales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            {cards.map((card, idx) => {
              const percentage = card.total > 0 ? (card.active / card.total) * 100 : 0;
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{card.title}</span>
                    {percentage === 100 ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : percentage > 75 ? (
                      <CheckCircle className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="text-2xl font-bold">{percentage.toFixed(0)}%</div>
                  <Progress value={percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {card.active} de {card.total} activos
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}