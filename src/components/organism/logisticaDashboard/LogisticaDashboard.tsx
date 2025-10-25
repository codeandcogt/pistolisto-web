import { usePiloto } from "@/hooks/usePiloto/usePiloto";
import { useVehiculo } from "@/hooks/useVehiculo/useVehiculo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Truck,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Fuel,
  Calendar,
  TrendingUp,
  User,
  Car
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function LogisticaDashboard() {
  const { pilotos } = usePiloto();
  const { vehiculos } = useVehiculo();

  // Calcular estadísticas de pilotos
  const statsPilotos = {
    totalPilotos: pilotos?.length || 0,
    pilotosActivos: pilotos?.filter(p => p.estado)?.length || 0,
    pilotosInactivos: pilotos?.filter(p => !p.estado)?.length || 0,
  };

  // Calcular estadísticas de vehículos
  const statsVehiculos = {
    totalVehiculos: vehiculos?.length || 0,
    vehiculosActivos: vehiculos?.filter(v => v.estado)?.length || 0,
    vehiculosInactivos: vehiculos?.filter(v => !v.estado)?.length || 0,
  };

  // Vehículos que necesitan mantenimiento (más de 60 días)
  const vehiculosMantenimiento = vehiculos?.filter(v => {
    if (!v.fechaUltimoMantenimiento) return true;
    const ultimoMantenimiento = new Date(v.fechaUltimoMantenimiento);
    const hoy = new Date();
    const diffDias = Math.floor((hoy.getTime() - ultimoMantenimiento.getTime()) / (1000 * 60 * 60 * 24));
    return diffDias > 60;
  }) || [];

  // Licencias próximas a vencer (30 días)
  const licenciasPorVencer = pilotos?.filter(p => {
    if (!p.fechaVencimientoLicencia) return false;
    const vencimiento = new Date(p.fechaVencimientoLicencia);
    const hoy = new Date();
    const diffDias = Math.floor((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diffDias <= 30 && diffDias >= 0;
  }) || [];

  // Capacidad total de la flota
  const capacidadTotal = vehiculos?.reduce((acc, v) => acc + (v.capacidad || 0), 0) || 0;
  const capacidadPesoTotal = vehiculos?.reduce((acc, v) => acc + (v.capacidadPeso || 0), 0) || 0;

  // Kilometraje total
  const kilometrajeTotal = vehiculos?.reduce((acc, v) => acc + (v.kilometraje || 0), 0) || 0;

  // Vehículos por piloto
  const vehiculosAsignados = vehiculos?.filter(v => v.pilotoId).length || 0;
  const vehiculosSinAsignar = statsVehiculos.totalVehiculos - vehiculosAsignados;

  const cards = [
    {
      title: "Total Pilotos",
      value: statsPilotos.totalPilotos,
      subtitle: `${statsPilotos.pilotosActivos} activos`,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      alert: licenciasPorVencer.length > 0 ? `${licenciasPorVencer.length} licencias por vencer` : null
    },
    {
      title: "Total Vehículos",
      value: statsVehiculos.totalVehiculos,
      subtitle: `${statsVehiculos.vehiculosActivos} operativos`,
      icon: Truck,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Mantenimientos Pendientes",
      value: vehiculosMantenimiento.length,
      subtitle: "Requieren revisión",
      icon: Wrench,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      alert: vehiculosMantenimiento.length > 0
    },
    {
      title: "Capacidad Total",
      value: capacidadTotal,
      subtitle: `${capacidadPesoTotal.toLocaleString()} kg`,
      icon: Car,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Vehículos sin Asignar",
      value: vehiculosSinAsignar,
      subtitle: `${vehiculosAsignados} asignados`,
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      alert: vehiculosSinAsignar > 0
    }
  ];

  // Agrupar vehículos por tipo
  const vehiculosPorTipo = vehiculos?.reduce((acc, v) => {
    const tipo = v.tipo || 'Sin tipo';
    if (!acc[tipo]) {
      acc[tipo] = [];
    }
    acc[tipo].push(v);
    return acc;
  }, {} as Record<string, typeof vehiculos>) || {};

  // Agrupar vehículos por combustible
  const vehiculosPorCombustible = vehiculos?.reduce((acc, v) => {
    const combustible = v.combustible || 'Sin especificar';
    if (!acc[combustible]) {
      acc[combustible] = 0;
    }
    acc[combustible]++;
    return acc;
  }, {} as Record<string, number>) || {};

  // Pilotos por tipo de licencia
  const pilotosPorLicencia = pilotos?.reduce((acc, p) => {
    const licencia = p.tipoLicencia || 'Sin especificar';
    if (!acc[licencia]) {
      acc[licencia] = 0;
    }
    acc[licencia]++;
    return acc;
  }, {} as Record<string, number>) || {};

  const porcentajePilotosActivos = statsPilotos.totalPilotos > 0 
    ? (statsPilotos.pilotosActivos / statsPilotos.totalPilotos) * 100 
    : 0;

  const porcentajeVehiculosActivos = statsVehiculos.totalVehiculos > 0 
    ? (statsVehiculos.vehiculosActivos / statsVehiculos.totalVehiculos) * 100 
    : 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Logística</h1>
          <p className="text-muted-foreground mt-1">Gestión de flota y pilotos</p>
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
          
          return (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`${card.bgColor} p-2 rounded-md`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {card.subtitle}
                  </p>
                  {card.alert && (
                    <Badge variant="destructive" className="w-full justify-center gap-1 text-xs mt-2">
                      <AlertTriangle className="w-3 h-3" />
                      {typeof card.alert === 'string' ? card.alert : 'Atención requerida'}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Estado de Recursos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Estado de Pilotos</CardTitle>
            <CardDescription>Disponibilidad del personal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="font-medium">Activos</span>
                  </div>
                  <span className="text-muted-foreground">
                    {statsPilotos.pilotosActivos} ({porcentajePilotosActivos.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={porcentajePilotosActivos} className="h-3" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="font-medium">Inactivos</span>
                  </div>
                  <span className="text-muted-foreground">
                    {statsPilotos.pilotosInactivos} ({(100 - porcentajePilotosActivos).toFixed(1)}%)
                  </span>
                </div>
                <Progress value={100 - porcentajePilotosActivos} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de Vehículos</CardTitle>
            <CardDescription>Disponibilidad de la flota</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="font-medium">Operativos</span>
                  </div>
                  <span className="text-muted-foreground">
                    {statsVehiculos.vehiculosActivos} ({porcentajeVehiculosActivos.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={porcentajeVehiculosActivos} className="h-3" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="font-medium">Fuera de Servicio</span>
                  </div>
                  <span className="text-muted-foreground">
                    {statsVehiculos.vehiculosInactivos} ({(100 - porcentajeVehiculosActivos).toFixed(1)}%)
                  </span>
                </div>
                <Progress value={100 - porcentajeVehiculosActivos} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Vehículos por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle>Flota por Tipo de Vehículo</CardTitle>
            <CardDescription>Distribución de la flota</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(vehiculosPorTipo)
              .sort((a, b) => b[1].length - a[1].length)
              .map(([tipo, vehs], idx) => {
                const cantidad = vehs.length;
                const porcentaje = ((cantidad / statsVehiculos.totalVehiculos) * 100).toFixed(1);
                const capacidadTipo = vehs.reduce((acc, v) => acc + (v.capacidad || 0), 0);
                
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-green-500" />
                        <div>
                          <span className="text-sm font-medium capitalize">{tipo}</span>
                          <p className="text-xs text-muted-foreground">
                            Capacidad: {capacidadTipo} unidades
                          </p>
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

        {/* Vehículos por Combustible */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Combustible</CardTitle>
            <CardDescription>Tipos de combustible de la flota</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(vehiculosPorCombustible)
              .sort((a, b) => b[1] - a[1])
              .map(([combustible, cantidad], idx) => {
                const porcentaje = ((cantidad / statsVehiculos.totalVehiculos) * 100).toFixed(1);
                
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium capitalize">{combustible}</span>
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

      {/* Pilotos por Tipo de Licencia */}
      <Card>
        <CardHeader>
          <CardTitle>Pilotos por Tipo de Licencia</CardTitle>
          <CardDescription>Clasificación del personal según licencia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(pilotosPorLicencia)
              .sort((a, b) => b[1] - a[1])
              .map(([licencia, cantidad], idx) => {
                const porcentaje = ((cantidad / statsPilotos.totalPilotos) * 100).toFixed(1);
                
                return (
                  <div key={idx} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">Tipo {licencia}</span>
                      </div>
                      <Badge variant="outline">{cantidad}</Badge>
                    </div>
                    <Progress value={parseFloat(porcentaje)} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">
                      {porcentaje}% del total
                    </p>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Alertas y Mantenimientos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Vehículos Requieren Mantenimiento
            </CardTitle>
            <CardDescription>Más de 60 días desde último servicio</CardDescription>
          </CardHeader>
          <CardContent>
            {vehiculosMantenimiento.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Todos los vehículos al día
              </div>
            ) : (
              <div className="space-y-3">
                {vehiculosMantenimiento.slice(0, 5).map((vehiculo, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{vehiculo.marca} {vehiculo.modelo}</p>
                      <p className="text-xs text-muted-foreground">Placa: {vehiculo.placa}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive" className="text-xs">
                        <Wrench className="w-3 h-3 mr-1" />
                        Urgente
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {vehiculo.kilometraje?.toLocaleString()} km
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-500" />
              Licencias Próximas a Vencer
            </CardTitle>
            <CardDescription>Vencen en los próximos 30 días</CardDescription>
          </CardHeader>
          <CardContent>
            {licenciasPorVencer.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Todas las licencias vigentes
              </div>
            ) : (
              <div className="space-y-3">
                {licenciasPorVencer.map((piloto, idx) => {
                  const diasRestantes = Math.floor(
                    (new Date(piloto.fechaVencimientoLicencia).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{piloto.nombres} {piloto.apellidos}</p>
                        <p className="text-xs text-muted-foreground">
                          Licencia: {piloto.numeroLicencia}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive" className="text-xs">
                          {diasRestantes} días
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Tipo {piloto.tipoLicencia}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumen General */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen General</CardTitle>
          <CardDescription>Métricas clave de la operación logística</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Ratio Piloto/Vehículo</p>
              <p className="text-2xl font-bold">
                {statsVehiculos.totalVehiculos > 0 
                  ? (statsPilotos.totalPilotos / statsVehiculos.totalVehiculos).toFixed(2)
                  : '0'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Kilometraje Total</p>
              <p className="text-2xl font-bold">{kilometrajeTotal.toLocaleString()} km</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Capacidad Promedio</p>
              <p className="text-2xl font-bold">
                {statsVehiculos.totalVehiculos > 0 
                  ? Math.round(capacidadTotal / statsVehiculos.totalVehiculos)
                  : 0} u
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tasa Operativa</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{porcentajeVehiculosActivos.toFixed(0)}%</p>
                {porcentajeVehiculosActivos >= 80 ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-yellow-500" />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Personal Disponible</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{porcentajePilotosActivos.toFixed(0)}%</p>
                {porcentajePilotosActivos >= 80 ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-yellow-500" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}