export type RouteType =
  | 'HOME'
  | 'DASHBOARD'
  | 'IMAGES'
  | 'IMAGE'
  | 'TAGS'
  | 'MANIFEST'
  | null;

export const getRouteTypeFromRoute = (route: string): RouteType => {
  const type = route.match(/^\/[_a-zA-Z0-9]*/);
  if (type) {
    const routeType = type[0].toLowerCase().substring(1);
    switch (routeType) {
      case '':
        return 'HOME';
      case 'dashboard':
        return 'DASHBOARD';
      case 'images':
        return 'IMAGES';
      case 'image':
        return 'IMAGE';
      case 'tags':
        return 'TAGS';
      case 'manifest':
        return 'MANIFEST';
      default:
        return null;
    }
  }
  return null;
};
