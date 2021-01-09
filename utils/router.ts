import { NextRouter } from 'next/router';
export interface Subtitle {
  name: string;
  url?: string;
}
interface LayoutInfo {
  title: string;
  subtitles: Subtitle[];
  sideTab: string | null;
}

export const getLayoutInfo = ({
  route,
  query = {},
}: NextRouter): LayoutInfo => {
  const layoutInfo: LayoutInfo = {
    title: 'Not Found',
    subtitles: [],
    sideTab: null,
  };

  const { id, name, tag } = query;

  switch (route) {
    case '/':
      layoutInfo.title = 'Home';
      layoutInfo.subtitles = [{ name: 'Registries ' }];
      break;
    case '/registries/new':
      layoutInfo.title = 'Create registry';
      layoutInfo.subtitles = [
        { name: 'Home', url: '/' },
        { name: 'Add registry' },
      ];
      break;
    case '/dashboard/[id]':
      layoutInfo.title = 'Registry Summary';
      layoutInfo.subtitles = [{ name: 'Registry Summary' }];
      break;
    case '/images/[id]':
      layoutInfo.title = 'Images';
      layoutInfo.subtitles = [{ name: 'Image List' }];
      break;
    case '/image/[id]/[name]':
      layoutInfo.title = 'Image';
      layoutInfo.subtitles = [
        { name: 'Images', url: `/images/${id}` },
        { name: 'Image', url: `/image/${id}/${name}` },
      ];
      break;
    case '/tags/[id]/[name]':
      layoutInfo.title = 'Tags';
      layoutInfo.subtitles = [
        { name: 'Images', url: `/images/${id}` },
        { name: name as string, url: `/image/${id}/${name}` },
        { name: 'Tags', url: `/tags/${id}/${name}` },
      ];
      break;
    case '/manifest/[id]/[name]/[tag]':
      layoutInfo.title = 'Manifest';
      layoutInfo.subtitles = [
        { name: 'Images', url: `/images/${id}` },
        { name: name as string, url: `/image/${id}/${name}` },
        { name: 'Tags', url: `/tags/${id}/${name}` },
        { name: tag as string, url: `/manifest/${id}/${name}` },
      ];
  }

  return layoutInfo;
};
