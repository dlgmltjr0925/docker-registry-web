import React, { useMemo } from 'react';

import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { RouteType } from '../utils/router';
import styled from 'styled-components';
import { useRouter } from 'next/router';

interface GetSubTitleArgs {
  routeType: RouteType;
  query: ParsedUrlQuery;
}
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

  .title-wrapper {
    padding-top: 7px;
    padding-left: 15px;

    .title {
      font-size: 17px;
      line-height: 150%;
      font-weight: 600;
      text-transform: capitalize;
      color: #333;
    }

    .sub-title {
      margin-top: 2px;
      font-size: 10px;
      font-weight: 600;

      span {
        color: #333;
      }

      a {
        color: #337ab7;
        text-decoration: none;
      }

      a:hover {
        color: #23527c;
        text-decoration: underline;
      }
    }
  }
`;

const getSubTitle = ({
  routeType,
  query,
}: GetSubTitleArgs): JSX.Element | null => {
  const { id, name, tag } = query;
  if (routeType === 'HOME') {
    return <span>Registries</span>;
  } else if (routeType === 'DASHBOARD') {
    return <span>Registry Summary</span>;
  } else if (routeType === 'IMAGES') {
    return <span>Image List</span>;
  } else if (routeType === 'IMAGE') {
    return (
      <>
        <Link href={`/images/${id}`}>
          <a>images</a>
        </Link>
        <span className='link'>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</span>
        <Link href={`/image/${id}/${name}`}>
          <a>{name || ''}</a>
        </Link>
      </>
    );
  } else if (routeType === 'TAGS') {
    return (
      <>
        <Link href={`/images/${id}`}>
          <a>images</a>
        </Link>
        <span className='link'>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</span>
        <Link href={`/image/${id}/${name}`}>
          <a>{name || ''}</a>
        </Link>
        <span className='link'>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</span>
        <Link href={`/tags/${id}/${name}`}>
          <a>tags</a>
        </Link>
      </>
    );
  } else if (routeType === 'MANIFEST') {
    return (
      <>
        <Link href={`/images/${id}`}>
          <a>images</a>
        </Link>
        <span className='link'>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</span>
        <Link href={`/image/${id}/${name}`}>
          <a>{name || ''}</a>
        </Link>
        <span className='link'>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</span>
        <Link href={`/tags/${id}/${name}`}>
          <a>tag</a>
        </Link>
        <span className='link'>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</span>
        <Link href={`/manifest/${id}/${name}/${tag}`}>
          <a>tag</a>
        </Link>
      </>
    );
  }
  return null;
};

const Header = ({ routeType }: HeaderProps) => {
  const { query } = useRouter();

  const title = useMemo(() => {
    return routeType ? routeType?.toLowerCase() : 'Not Found';
  }, [routeType]);

  const subTitle = useMemo(() => {
    return getSubTitle({ query, routeType });
  }, [routeType, query]);

  return (
    <HeaderWrapper>
      <div className='title-wrapper'>
        <p className='title'>{title}</p>
        <div className='sub-title'>{subTitle}</div>
      </div>
    </HeaderWrapper>
  );
};

export default Header;
