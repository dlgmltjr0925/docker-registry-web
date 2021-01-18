import { Image, Registry, Tag } from '../../../interfaces';
import React, { useCallback, useMemo, useState } from 'react';
import TagItem, { Item } from '../../../components/tags/TagItem';
import axios, { AxiosResponse } from 'axios';

import { ApiResult } from '../../../interfaces/api';
import { GetServerSidePropsContext } from 'next';
import IconSearch from '../../../public/images/icon_search.svg';
import IconTags from '../../../public/images/icon_tags.svg';
import styled from 'styled-components';

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

const Tags = ({ tags = [] }: TagsProps) => {
  const [keyword, setKeyword] = useState<string>('');

  const _handleChangeKeyword = useCallback(
    ({ target: { value } }) => {
      setKeyword(value);
    },
    [setKeyword]
  );

  const tagItems = useMemo<Item[]>(() => {
    const sortedTags = tags.sort((a, b) => (a.name < b.name ? 1 : -1));
    const digestObject: Record<string, Item> = {};
    sortedTags.forEach((tag) => {
      const { digest, name, layers } = tag;
      if (!digest || !layers) return;
      if (!digestObject[digest]) {
        digestObject[digest] = { digest, names: [name], layers };
      } else {
        digestObject[digest].names.push(name);
      }
    });

    return Object.values(digestObject);
  }, [tags]);

  const filteredTags = useMemo<Item[]>(() => {
    if (keyword.trim() === '') return tagItems;

    try {
      const regExps = keyword
        .trim()
        .split(' ')
        .map((keyword) => new RegExp(keyword));

      return tagItems.filter(({ names }) => {
        const name = names.join(' ');
        for (let regExp of regExps) {
          if (regExp.test(name)) return true;
        }
      });
    } catch (error) {
      return tagItems;
    }
  }, [tagItems, keyword]);

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
            placeholder='Search by tag'
            value={keyword}
            onChange={_handleChangeKeyword}
          />
        </div>
        <div className='widget-row-wrapper'>
          {filteredTags.length === 0 ? (
            <p className='empty-content'>No Tag available</p>
          ) : (
            <ul>
              {filteredTags.map((tag) => {
                return <TagItem key={tag.digest} item={tag} />;
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
  let res: AxiosResponse<ApiResult<Registry | Image | Tag[]>>;
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

  res = await axios.get<ApiResult<Tag[]>>(
    `http://localhost:3000/api/tags/${id}/${name}`
  );

  if (res && res.data) {
    const { status, data } = res.data;
    if (status === 200) {
      props.tags = data as Tag[];
    }
  }

  return {
    props,
  };
};

export default Tags;
