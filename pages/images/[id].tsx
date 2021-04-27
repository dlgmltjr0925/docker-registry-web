import { Image, Registry, Tag } from '../../interfaces';
import ImageItem, { Item } from '../../components/images/ImageItem';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ApiResult } from '../../interfaces/api';
import { GetServerSidePropsContext } from 'next';
import IconCubes from '../../public/images/icon_cubes.svg';
import IconSearch from '../../public/images/icon_search.svg';
import axios from 'axios';
import styled from 'styled-components';
import { useRouter } from 'next/router';

interface WrapperProps {}

interface ImagesProps {
  registry?: Registry;
  tags: Record<string, Tag[]>;
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

const Images = ({ registry }: ImagesProps) => {
  const router = useRouter();
  const [keyword, setKeyword] = useState<string>('');
  const [images, setImages] = useState<Image[]>(registry?.images || []);

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

      return images.filter(({ name, tags }) => {
        const tag =
          tags && tags.length > 0 ? tags.map(({ name }) => name).join(' ') : '';
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
          const { status, message } = res.data;
          if (status === 200) {
            setImages(images.filter((image) => image.name !== name));
          } else if (status === 405) {
            // Method Not Allowed, REGISTRY_STORAGE_DELETE_ENABLED = "true"
            alert(message);
          } else {
            alert(message);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    []
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
              {filteredImages.map(({ name, tags = [] }) => {
                const item = {
                  registryId: registry.id,
                  name: name,
                  tags,
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
    `http://${process.env.host}:${process.env.port}/api/registry/${id}`
  );

  if (result && result.data) {
    const { status, data } = result.data;
    if (status === 200) {
      props['registry'] = data;
    }
  }

  return {
    props,
  };
};

export default Images;
