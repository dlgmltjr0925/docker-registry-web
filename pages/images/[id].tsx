import { Image, Registry } from '../../interfaces';
import ImageItem, { Item } from '../../components/images/ImageItem';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ApiResult } from '../../interfaces/api';
import { GetServerSidePropsContext } from 'next';
import IconCubes from '../../public/images/icon_cubes.svg';
import IconSearch from '../../public/images/icon_search.svg';
import axios from 'axios';
import { promiseAll } from '../../utils/async';
import styled from 'styled-components';
import { useRouter } from 'next/router';

interface WrapperProps {}

interface ImagesProps {
  registry?: Registry;
  tags: Record<string, string[]>;
}

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

const Images = ({ registry, ...props }: ImagesProps) => {
  const router = useRouter();
  const [images] = useState<Image[]>(registry?.images || []);
  const [tags, setTags] = useState<Record<string, string[]>>(props.tags);
  const [keyword, setKeyword] = useState<string>('');

  const _handleChangeKeyword = useCallback(
    ({ target: { value } }) => {
      setKeyword(value);
    },
    [setKeyword]
  );

  const filteredImages = useMemo<Image[]>(() => {
    if (keyword.trim() === '') return images;

    try {
      const regExps = keyword
        .trim()
        .split(' ')
        .map((keyword) => new RegExp(keyword));

      return images.filter(({ name }) => {
        const tag = tags[name] ? tags[name].join(' ') : '';
        for (let regExp of regExps) {
          if (regExp.test(name) || regExp.test(tag)) return true;
        }
        return false;
      });
    } catch (error) {
      return images;
    }
  }, [keyword, images]);

  const _handleClickRemoveImage = useCallback(
    async ({ registryId, name }: Item) => {
      try {
        const res = await axios.delete<ApiResult<string[]>>(
          `${window.location.origin}/api/image/${registryId}/${name}`
        );
        if (res && res.data) {
          const { status, message, data } = res.data;
          if (status === 200) {
            const newTags = { ...tags };
            newTags[name] = newTags[name].filter((tag) => !data.includes(tag));
            setTags(newTags);
          } else {
            alert(message);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [tags, setTags]
  );

  useEffect(() => {
    if (!registry) router.push('/');
  }, [registry]);

  if (!registry) return null;

  return (
    <Wrapper>
      <div className='widget-wrapper'>
        <div className='widget-header-wrapper'>
          <div className='header-title'>
            <IconCubes className='header-icon' />
            <span>Images</span>
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
          {filteredImages.length === 0 ? (
            <p className='empty-content'>No Image available</p>
          ) : (
            <ul>
              {filteredImages.map(({ name }) => {
                const item = {
                  registryId: registry.id,
                  name: name,
                  tags: tags[name] || [],
                };

                return (
                  <ImageItem
                    key={name}
                    item={item}
                    onClickRemove={_handleClickRemoveImage}
                  />
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export const getServerSideProps = async ({
  query: { id },
}: GetServerSidePropsContext) => {
  const props: ImagesProps = {
    registry: undefined,
    tags: {},
  };

  const result = await axios.get<ApiResult<Registry>>(
    `http://localhost:3000/api/registry/${id}`
  );

  if (result && result.data) {
    const { status, data } = result.data;
    if (status === 200) {
      props['registry'] = data;
      if (data.images) {
        await promiseAll(
          data.images.map(async ({ name }) => {
            try {
              const result = await axios.get<ApiResult<string[]>>(
                `http://localhost:3000/api/tags/${id}/${name}`
              );

              if (result && result.data) {
                const { status, data } = result.data;
                if (status === 200) props.tags[name] = data;
              }

              return null;
            } catch (error) {
              console.log(error);
            }
          })
        );
      }
    }
  }

  return {
    props,
  };
};

export default Images;
