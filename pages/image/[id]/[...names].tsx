import { GetServerSidePropsContext } from 'next';
import React from 'react';
import axios from 'axios';
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

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const props = {};

  const { id, names } = context.query as { id: string; names: string[] };

  const name = names.join('/');

  const res = await axios.get(`http://localhost:3000/api/image/${id}/${name}`);

  // console.log(res);

  return {
    props,
  };
};

export default Image;
