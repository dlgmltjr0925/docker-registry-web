import { Image, Registry } from '../../../interfaces';
import React, { useCallback, useEffect, useMemo } from 'react';
import axios, { AxiosResponse } from 'axios';

import { ApiResult } from '../../../interfaces/api';
import { GetServerSidePropsContext } from 'next';
import IconCopy from '../../../public/images/icon_copy.svg';
import IconCube from '../../../public/images/icon_cube.svg';
import IconGear from '../../../public/images/icon_gear.svg';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { useRouter } from 'next/router';

interface ImagePageProps {
  registry?: Registry;
  image?: Image;
  tags?: string[];
}

interface WrapperProps {}

const Wrapper = styled.div<WrapperProps>`
  .widget-header-wrapper {
    position: relative;

    .setting-button {
      position: absolute;
      top: 0;
      right: 0;
      width: 50px;
      height: 100%;
      outline: none;

      svg {
        width: 20px;
        height: 20px;

        path {
          fill: #777;
        }
      }

      &:hover {
        svg path {
          fill: #555;
        }
      }
    }
  }

  .widget-row-wrapper {
    border-top: 1px solid #ccc;

    .name {
      display: block;
      margin: 10px 0 10px 10px;
      font-size: 18px;
      font-weight: 500;
      color: #555;
    }

    .command-wrapper {
      padding: 10px;

      p:first-child {
        font-size: 14px;
        color: #8f9ea8;
        margin: 0 0 10px 5px;
      }

      .command {
        position: relative;
        background: #27343b;
        padding: 15px 10px 15px 40px;
        color: #fff;
        font-size: 13px;
      }

      .copy {
        position: absolute;
        left: 10px;
        top: 10px;
        width: 20px;
        height: 20px;
        outline: none;

        path {
          fill: #fff;
        }
      }

      .tags {
        display: inline-block;
        margin-top: 10px;
        margin-left: 5px;
        font-size: 13px;
        color: #888;
        cursor: pointer;

        &:hover {
          color: #666;
          text-decoration: underline;
        }
      }
    }
  }

  .markdown * {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
      sans-serif, Apple Color Emoji, Segoe UI Emoji;
  }

  .widget-row-wrapper.summary {
    border: 0;
    padding: 25px;
  }
`;

const ImagePage = ({ registry, image, tags }: ImagePageProps) => {
  const router = useRouter();

  useEffect(() => {
    if (!registry || !image || !tags) router.push('/');
  }, [registry, image]);

  if (!registry || !image || !tags) return null;

  const pullCommand = useMemo<string | null>(() => {
    if (tags.length === 0) return null;
    const tag = tags[tags.length - 1];
    return `docker pull https://${registry.url}/${image.name}:${tag}`;
  }, [registry, image, tags]);

  const _handleClickCopy = useCallback(() => {
    if (pullCommand === null) return;

    const tempEl = document.createElement('textarea');
    tempEl.value = pullCommand;
    document.body.appendChild(tempEl);

    tempEl.select();
    document.execCommand('copy');
    document.body.removeChild(tempEl);
    alert('Copied.');
  }, [pullCommand]);

  return (
    <Wrapper>
      <div className='widget-wrapper'>
        <div className='widget-header-wrapper'>
          <div className='header-title'>
            <IconCube className='header-icon' />
            <span>Image</span>
          </div>
          <Link href={`/image/edit/${registry.id}/${image.name}`}>
            <button className='setting-button'>
              <IconGear />
            </button>
          </Link>
        </div>
        <div className='widget-row-wrapper'>
          <span className='name'>{image.name}</span>
          {pullCommand !== null && (
            <div className='command-wrapper'>
              <p>Copy and paste to pull this image</p>
              <div className='command'>
                <span id='command'>{pullCommand}</span>
                <button className='copy' onClick={_handleClickCopy}>
                  <IconCopy />
                </button>
              </div>
              <Link href={`/tags/${registry.id}/${image.name}`}>
                <p className='tags'>View Available Tags</p>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className='widget-wrapper'>
        <div className='widget-row-wrapper summary'>
          <div className='markdown markdown-body'>
            {/* <div
            className='markdown'
            dangerouslySetInnerHTML={{ __html: mdAst.toString() }}
          /> */}
            {/* <ReactMarkdown children={md} /> */}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const props: Partial<ImagePageProps> = {};

  const { id, names } = context.query as { id: string; names: string[] };

  const name = names.join('/');

  // registry
  let res: AxiosResponse<ApiResult<Registry | Image | string[]>>;
  res = await axios.get<ApiResult<Registry>>(
    `http://localhost:3000/api/registry/${id}`
  );

  if (res && res.data) {
    const { status, data } = res.data;
    if (status === 200) props.registry = data as Registry;
  }

  res = await axios.get<ApiResult<Image>>(
    `http://localhost:3000/api/image/${id}/${name}`
  );

  if (res && res.data) {
    const { status, data } = res.data;
    if (status === 200) props.image = data as Image;
  }

  res = await axios.get<ApiResult<string[]>>(
    `http://localhost:3000/api/tags/${id}/${name}`
  );

  if (res && res.data) {
    const { status, data } = res.data;
    if (status === 200) props.tags = data as string[];
  }

  return {
    props,
  };
};

export default ImagePage;
