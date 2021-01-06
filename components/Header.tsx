import React, { useMemo } from 'react';

import styled from 'styled-components';
import { useRouter } from 'next/router';

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  background: #fff;
  margin-bottom: 15px;
  padding: 7px 15px;

  .title-wrapper {
    .title {
      font-size: 17px;
      line-height: 150%;
      font-weight: 600;
    }
  }
`;

const Header = () => {
  const { route } = useRouter();

  const title = useMemo(() => {
    return 'home';
  }, [route]);

  return (
    <HeaderWrapper>
      <div className='title-wrapper'>
        <p className='title'>{title}</p>
      </div>
      <p className='path'></p>
    </HeaderWrapper>
  );
};

export default Header;
