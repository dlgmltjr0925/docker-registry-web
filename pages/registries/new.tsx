import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

interface WrapperProps {}

const Wrapper = styled.div<WrapperProps>``;

const New = () => {
  const router = useRouter();
  console.log('tag', router);

  return (
    <Wrapper>
      <p>{router.query.id}</p>
      <p>{router.query.name}</p>
      <div>New</div>
    </Wrapper>
  );
};

export default New;
