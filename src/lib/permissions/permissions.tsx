import { navigationItems, Role } from "../navigation";

export const routePermissions: Record<string, Role[]> = {};

function extractRoutes(items: typeof navigationItems) {
  items.forEach(item => {
    if (item.url) {
      routePermissions[item.url] = item.roles;
    }
    if (item.items) {
      item.items.forEach(subItem => {
        if (subItem.url) {
          routePermissions[subItem.url] = subItem.roles;
        }
      });
    }
  });
}

extractRoutes(navigationItems);

export function hasAccess(pathname: string, userRole: Role): boolean {
  if (routePermissions[pathname]) {
    return routePermissions[pathname].includes(userRole);
  }
  
  for (const [route, roles] of Object.entries(routePermissions)) {
    if (pathname.startsWith(route + '/') || pathname === route) {
      return roles.includes(userRole);
    }
  }
  
  return false;
}