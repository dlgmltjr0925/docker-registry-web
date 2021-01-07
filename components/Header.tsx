import React, { useMemo } from 'react';

import { RouteType } from '../utils/router';
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
  const { query } = useRouter();

  const title = useMemo(() => {
    return routeType ? routeType?.toLowerCase() : 'Not Found';
  }, [routeType]);

  return (
    <HeaderWrapper>
      <div className='title-wrapper'>
        <p className='title'>{title}</p>
        <p>{query.id}</p>
      </div>
      <p className='path'></p>
    </HeaderWrapper>
  );
};

export default Header;
