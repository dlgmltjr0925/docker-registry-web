import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

interface WrapperProps {}

const Wrapper = styled.div<WrapperProps>``;

const Tags = () => {
  const router = useRouter();
  console.log('tag', router);

  return (
    <Wrapper>
      <p>{router.query.id}</p>
      <p>{router.query.name}</p>
      <div>Tags</div>
      <Link href='/manifest/1/arm64v8/tag'>
        <span>tag</span>
      </Link>
    </Wrapper>
  );
};

export default Tags;
