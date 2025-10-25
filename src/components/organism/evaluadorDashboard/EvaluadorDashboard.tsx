import { useArticulo } from "@/hooks/useArticulo/useArticulo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  CheckCircle,
  Activity,
  BarChart3,
  PackageCheck,
  PackageX,
  TrendingUp,
  Warehouse
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function EvaluadorDashboard() {
  const { articulos } = useArticulo();

  // Calcular estadísticas de artículos
  const stats = {
    totalArticulos: articulos?.length || 0,
    articulosActivos: articulos?.filter(a => a.estado)?.length || 0,
    articulosInactivos: articulos?.filter(a => !a.estado)?.length || 0,
  };

  // Agrupar por almacén
  const articulosPorAlmacen = articulos?.reduce((acc, art) => {
    const almacen = art.idAlmacen;
    if (!acc[almacen]) {
      acc[almacen] = [];
    }
    acc[almacen].push(art);
    return acc;
  }, {} as Record<number, typeof articulos>) || {};

  // Agrupar por color
  const articulosPorColor = articulos?.reduce((acc, art) => {
    const color = art.color || 'Sin color';
    if (!acc[color]) {
      acc[color] = 0;
    }
    acc[color]++;
    return acc;
  }, {} as Record<string, number>) || {};

  // Calcular peso total
  const pesoTotal = articulos?.reduce((acc, art) => acc + (art.peso || 0), 0) || 0;

  // Artículos más pesados (top 5)
  const articulosPesados = articulos
    ?.sort((a, b) => (b.peso || 0) - (a.peso || 0))
    .slice(0, 5) || [];

  const cards = [
    {
      title: "Total Artículos",
      value: stats.totalArticulos,
      description: "Registrados en el sistema",
      icon: Package,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Artículos Activos",
      value: stats.articulosActivos,
      description: "Disponibles para uso",
      icon: PackageCheck,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Artículos Inactivos",
      value: stats.articulosInactivos,
      description: "Fuera de circulación",
      icon: PackageX,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Almacenes con Stock",
      value: Object.keys(articulosPorAlmacen).length,
      description: "Con artículos asignados",
      icon: Warehouse,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Peso Total",
      value: `${pesoTotal.toFixed(2)} kg`,
      description: "Inventario completo",
      icon: BarChart3,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    }
  ];

  const porcentajeActivos = stats.totalArticulos > 0 
    ? (stats.articulosActivos / stats.totalArticulos) * 100 
    : 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Evaluador</h1>
          <p className="text-muted-foreground mt-1">Gestión y control de artículos</p>
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
                    {card.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Estado de Artículos */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Artículos</CardTitle>
          <CardDescription>Proporción de artículos activos vs inactivos</CardDescription>
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
                  {stats.articulosActivos} ({porcentajeActivos.toFixed(1)}%)
                </span>
              </div>
              <Progress value={porcentajeActivos} className="h-3" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="font-medium">Inactivos</span>
                </div>
                <span className="text-muted-foreground">
                  {stats.articulosInactivos} ({(100 - porcentajeActivos).toFixed(1)}%)
                </span>
              </div>
              <Progress value={100 - porcentajeActivos} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Distribución por Almacén */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Almacén</CardTitle>
            <CardDescription>Artículos asignados por ubicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(articulosPorAlmacen)
              .sort((a, b) => b[1].length - a[1].length)
              .slice(0, 5)
              .map(([almacen, arts], idx) => {
                const cantidad = arts.length;
                const porcentaje = ((cantidad / stats.totalArticulos) * 100).toFixed(1);
                const activos = arts.filter(a => a.estado).length;
                
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <div>
                          <span className="text-sm font-medium">Almacén #{almacen}</span>
                          <p className="text-xs text-muted-foreground">
                            {activos} activos de {cantidad}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {porcentaje}%
                      </Badge>
                    </div>
                    <Progress value={parseFloat(porcentaje)} className="h-2" />
                  </div>
                );
              })}
          </CardContent>
        </Card>

        {/* Distribución por Color */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Color</CardTitle>
            <CardDescription>Clasificación cromática del inventario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(articulosPorColor)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([color, cantidad], idx) => {
                const porcentaje = ((cantidad / stats.totalArticulos) * 100).toFixed(1);
                
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full border border-muted"
                          style={{ backgroundColor: color !== 'Sin color' ? color : '#666' }}
                        ></div>
                        <span className="text-sm font-medium capitalize">{color}</span>
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

      {/* Artículos Más Pesados */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Artículos Más Pesados</CardTitle>
          <CardDescription>Artículos ordenados por peso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {articulosPesados.map((articulo, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    #{idx + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{articulo.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {articulo.descripcion || 'Sin descripción'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={articulo.estado ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {articulo.estado ? 'Activo' : 'Inactivo'}
                  </Badge>
                  <div className="text-right">
                    <p className="font-bold">{articulo.peso} kg</p>
                    <p className="text-xs text-muted-foreground">
                      {articulo.dimension || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumen Rápido */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen Rápido</CardTitle>
          <CardDescription>Métricas clave del inventario</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Promedio de Peso</p>
              <p className="text-2xl font-bold">
                {stats.totalArticulos > 0 
                  ? (pesoTotal / stats.totalArticulos).toFixed(2) 
                  : 0} kg
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Colores Distintos</p>
              <p className="text-2xl font-bold">{Object.keys(articulosPorColor).length}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tasa de Activación</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{porcentajeActivos.toFixed(0)}%</p>
                {porcentajeActivos >= 75 ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-yellow-500" />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Almacenes Ocupados</p>
              <p className="text-2xl font-bold">
                {Object.keys(articulosPorAlmacen).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}