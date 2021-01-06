import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

interface WrapperProps {}

const Wrapper = styled.div<WrapperProps>``;

const Images = () => {
  const route = useRouter();

  return (
    <Wrapper>
      <div>{route.query.id}</div>
      <div>images</div>
    </Wrapper>
  );
};

export default Images;
