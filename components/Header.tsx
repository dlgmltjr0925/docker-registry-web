import React, { useMemo } from 'react';

import Link from 'next/link';
import { RouteType } from '../utils/router';
import { route } from 'next/dist/next-server/server/router';
import styled from 'styled-components';
import { useRouter } from 'next/router';

interface HeaderProps {
  routeType: RouteType;
}

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  background: #fff;
  margin-bottom: 15px;
  padding: 9px 15px;

  .title-wrapper {
    .title {
      font-size: 17px;
      line-height: 150%;
      font-weight: 600;
      text-transform: capitalize;
      color: #333;
    }
  }
`;

const Header = ({ routeType }: HeaderProps) => {
  const { route, query } = useRouter();

  const title = useMemo(() => {
    return routeType ? routeType?.toLowerCase() : 'Not Found';
  }, [routeType]);

  const subTitle = useMemo(() => {
    const { id, name } = query;
    if (routeType === 'HOME') {
      return (
        <div>
          <span>Endpoints</span>
        </div>
      );
    } else if (routeType === 'DASHBOARD') {
      return (
        <div>
          <span>Endpoint Summary</span>
        </div>
      );
    } else if (routeType === 'IMAGES') {
      return (
        <div>
          <span>Image List</span>
        </div>
      );
    } else if (routeType === 'IMAGE') {
      return (
        <div>
          <Link href={`/images/${id}`}>
            <span>images</span>
          </Link>
          {` > `}
          <Link href={`/image/${id}/${name}`}>
            <span>{name || ''}</span>
          </Link>
        </div>
      );
    } else if (routeType === 'TAGS') {
      return (
        <div>
          <Link href={`/images/${id}`}>
            <span>images</span>
          </Link>
          {` > `}
          <Link href={`/image/${id}/${name}`}>
            <span>{name || ''}</span>
          </Link>
          {` > `}
          <Link href={`/tags/${id}/${name}`}>
            <span>tags</span>
          </Link>
        </div>
      );
    } else if (routeType === 'MANIFEST') {
      return (
        <div>
          <Link href={`/images/${id}`}>
            <span>images</span>
          </Link>
          {` > `}
          <Link href={`/image/${id}/${name}`}>
            <span>{name || ''}</span>
          </Link>
          {` > `}
          <Link href={`/tags/${id}/${name}`}>
            <span>tags</span>
          </Link>
        </div>
      );
    }
    return null;
  }, [routeType, query]);

  return (
    <HeaderWrapper>
      <div className='title-wrapper'>
        <p className='title'>{title}</p>
        <div>{subTitle}</div>
      </div>
      <p className='path'></p>
    </HeaderWrapper>
  );
};

export default Header;
