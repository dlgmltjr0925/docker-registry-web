import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

interface ImageProps {}

interface WrapperProps {}

const Wrapper = styled.div<WrapperProps>``;

const Image = (props: ImageProps) => {
  const router = useRouter();

  console.log(props);
  console.log(router.query);

  return (
    <Wrapper>
      <div>{router.query.id}</div>
      <div>{router.query.name}</div>
      <div>image</div>
    </Wrapper>
  );
};

export default Image;
