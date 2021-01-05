import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  background: #fff;
  margin-bottom: 15px;
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <p className='content-title'>Home</p>
      <p className='content-path'></p>
    </HeaderWrapper>
  );
};

export default Header;
