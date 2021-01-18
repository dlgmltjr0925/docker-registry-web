import IconTags from '../../../public/images/icon_tags.svg';
import React from 'react';
import styled from 'styled-components';

interface WrapperProps {}

const Wrapper = styled.div<WrapperProps>``;

const Manifest = () => {
  return (
    <Wrapper>
      <div className='widget-header-wrapper'>
        <div className='header-title'>
          <IconTags className='header-icon' />
          <span>Images</span>
        </div>
      </div>
    </Wrapper>
  );
};

export default Manifest;
