import { Image, Registry, Tag } from '../../../interfaces';
import React, { useCallback, useMemo, useState } from 'react';
import axios, { AxiosResponse } from 'axios';

import { ApiResult } from '../../../interfaces/api';
import { GetServerSidePropsContext } from 'next';
import IconSearch from '../../../public/images/icon_search.svg';
import IconTags from '../../../public/images/icon_tags.svg';
import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/router';

interface WrapperProps {}

const Wrapper = styled.div<WrapperProps>`
  .search-wrapper {
    border-top: 1px solid #d2d1d1;
    border-bottom: 1px solid #d2d1d1;

    .search-icon {
      width: 17px;
      height: 100%;
      vertical-align: middle;

      path {
        fill: #767676;
      }
    }

    input {
      width: 95%;
      margin-left: 10px;
      outline: none;
      border: none;
      font-size: 14px;
      line-height: 22px;
    }
  }

  .empty-content {
    display: block;
    text-align: center;
    padding: 15px 0;
  }

  .content-wrapper {
    padding-bottom: 10px;
  }
`;

interface TagsProps {
  registry?: Registry;
  image?: Image;
  tags?: Tag[];
}

const Tags = ({ tags }: TagsProps) => {
  const router = useRouter();
  const [keyword, setKeyword] = useState<string>('');

  const _handleChangeKeyword = useCallback(
    ({ target: { value } }) => {
      setKeyword(value);
    },
    [setKeyword]
  );

  const filteredTags = useMemo<Tag[]>(() => {
    if (keyword.trim() === '') return tags;

    return [];
  }, []);

  return (
    <Wrapper>
      <div className='widget-wrapper'>
        <div className='widget-header-wrapper'>
          <div className='header-title'>
            <IconTags className='header-icon' />
            <span>Tags</span>
          </div>
        </div>
        {/* search */}
        <div className='widget-row-wrapper search-wrapper'>
          <IconSearch className='search-icon' />
          <input
            type='text'
            placeholder='Search by name, tag'
            value={keyword}
            onChange={_handleChangeKeyword}
          />
        </div>
        <div className='widget-row-wrapper'>
          {filteredTags.length === 0 ? (
            <p className='empty-content'>No Tag available</p>
          ) : (
            <ul>
              {filteredTags.map(({ name }) => {
                return <div key={name}>{name}</div>;
              })}
            </ul>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const props: Partial<TagsProps> = {};

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
    if (status === 200) {
      props.tags = (data as string[]).map((name) => ({
        name,
      }));
    }
  }

  return {
    props,
  };
};

export default Tags;
