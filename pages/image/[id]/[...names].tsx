import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

interface ImageProps {}

interface WrapperProps {}

const Wrapper = styled.div<WrapperProps>``;

const Image = ({}: ImageProps) => {
  const router = useRouter();

  return (
    <Wrapper>
      <div>{router.query.id}</div>
      <div>image</div>
    </Wrapper>
  );
};

export default Image;
