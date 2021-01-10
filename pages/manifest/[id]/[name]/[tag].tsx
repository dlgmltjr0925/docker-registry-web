import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

interface WrapperProps {}

const Wrapper = styled.div<WrapperProps>``;

const Manifest = () => {
  const router = useRouter();

  return (
    <Wrapper>
      <p>{router.query.id}</p>
      <p>{router.query.name}</p>
      <div>Manifest</div>
    </Wrapper>
  );
};

export default Manifest;
