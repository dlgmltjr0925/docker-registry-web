import { NextRouter } from 'next/router';
export interface Subtitle {
  name: string;
  url?: string;
}

export type SideTabType = 'home' | 'dashboard' | 'images' | 'image' | 'tags';
export interface SideTab {
  type: SideTabType;
  options?: Record<string, unknown>;
}
interface LayoutInfo {
  title: string;
  subtitles: Subtitle[];
  sideTabs: SideTab[];
}

export const getLayoutInfo = ({
  route,
  query = {},
}: NextRouter): LayoutInfo => {
  const layoutInfo: LayoutInfo = {
    title: 'Not Found',
    subtitles: [],
    sideTabs: [],
  };

  const { id, name, tag } = query;

  switch (route) {
    case '/':
      layoutInfo.title = 'Home';
      layoutInfo.subtitles = [{ name: 'Registries ' }];
      layoutInfo.sideTabs = [{ type: 'home' }];
      break;
    case '/registries/new':
      layoutInfo.title = 'Create registry';
      layoutInfo.subtitles = [
        { name: 'Home', url: '/' },
        { name: 'Add registry' },
      ];
      layoutInfo.sideTabs = [{ type: 'home' }];
      break;
    case '/dashboard/[id]':
      layoutInfo.title = 'Registry Summary';
      layoutInfo.subtitles = [{ name: 'Registry Summary' }];
      layoutInfo.sideTabs = [{ type: 'dashboard' }];
      break;
    case '/images/[id]':
      layoutInfo.title = 'Images';
      layoutInfo.subtitles = [{ name: 'Image List' }];
      layoutInfo.sideTabs = [{ type: 'images' }];
      break;
    case '/image/[id]/[name]':
      layoutInfo.title = 'Image';
      layoutInfo.subtitles = [
        { name: 'Images', url: `/images/${id}` },
        { name: 'Image', url: `/image/${id}/${name}` },
      ];
      layoutInfo.sideTabs = [{ type: 'image', options: { name } }];
      break;
    case '/tags/[id]/[name]':
      layoutInfo.title = 'Tags';
      layoutInfo.subtitles = [
        { name: 'Images', url: `/images/${id}` },
        { name: name as string, url: `/image/${id}/${name}` },
        { name: 'Tags', url: `/tags/${id}/${name}` },
      ];
      layoutInfo.sideTabs = [
        { type: 'image', options: { name } },
        { type: 'tags', options: { name } },
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
      layoutInfo.sideTabs = [
        { type: 'image', options: { name } },
        { type: 'tags', options: { name } },
      ];
      break;
  }

  return layoutInfo;
};
