import React, { useEffect } from 'react';

import { ApiResult } from '../../../interfaces/api';
import { GetServerSidePropsContext } from 'next';
import { Image } from '../../../interfaces';
import axios from 'axios';
import styled from 'styled-components';
import { useRouter } from 'next/router';

interface ImagePageProps {
  image?: Image;
}

interface WrapperProps {}

const Wrapper = styled.div<WrapperProps>``;

const ImagePage = ({ image }: ImagePageProps) => {
  const router = useRouter();

  console.log(image);

  useEffect(() => {
    if (!image) router.push('/');
  }, [image]);

  if (!image) return null;

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
  const props: Partial<ImagePageProps> = {};

  const { id, names } = context.query as { id: string; names: string[] };

  const name = names.join('/');

  const res = await axios.get<ApiResult<Image>>(
    `http://localhost:3000/api/image/${id}/${name}`
  );

  if (res && res.data) {
    const { status, data } = res.data;
    if (status === 200) {
      props.image = data;
    }
  }

  return {
    props,
  };
};

export default ImagePage;
