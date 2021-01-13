import React, { useCallback } from 'react';

import IconCube from '../../public/images/icon_cube.svg';
import IconTags from '../../public/images/icon_tags.svg';
import IconTrash from '../../public/images/icon_trash.svg';
import Link from 'next/link';
import styled from 'styled-components';

export interface Item {
  registryId: number;
  name: string;
  tags?: string[];
}

interface ImageItemProps {
  item: Item;
  onClickRemove: (item: Item) => void;
}

interface ImageWrapperProps {}

const ImageWrapper = styled.li<ImageWrapperProps>`
  position: relative;
  margin: 10px 5px 20px;
  padding: 10px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  cursor: pointer;
  box-shadow: 1px 1px 3px #ccc;
  border-radius: 3px;
  overflow: hidden;
  transition: box-shadow 0.15s ease-in-out;

  &:hover {
    box-shadow: 2px 2px 5px #ccc;
  }

  .item-wrapper {
    display: inline-block;
    .image {
      width: 55px;
      height: 100%;
      vertical-align: top;

      path {
        fill: #334267;
      }
    }

    .content-wrapper {
      display: inline-block;
      margin-left: 10px;

      .name-wrapper {
        .name {
          font-size: 19px;
          font-weight: 600;
          margin-right: 10px;
          color: #333 !important;
          vertical-align: middle;
        }

        .status {
          display: inline-block;
          color: white;
          padding: 2px 7px 3px;
          font-size: 10px;
          border-radius: 3px;
        }

        .date {
          margin-left: 8px;
          color: #777;
          font-size: 14px;
        }
      }

      .tags-category-wrapper {
        margin-top: 10px;
        padding-bottom: 2px;

        svg {
          display: inline-block;
          width: 15px;
          height: 100%;
          margin-right: 10px;
          vertical-align: middle;

          path {
            fill: #286090;
          }
        }
      }

      .tags-wrapper {
        margin-top: 10px;

        li {
          display: inline-block;
          padding: 4px 7px;
          background: #286090;
          margin-right: 10px;
          border-radius: 3px;
          color: #fff;
          font-size: 13px;

          &:hover {
            background: #1e4669;
          }

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }

  .remove-button {
    position: absolute;
    top: 10px;
    right: 10px;
    outline: none;

    svg {
      width: 20px;
      height: 20px;

      path {
        fill: #dc9690;
      }

      &:hover {
        path {
          fill: #c9302c;
        }
      }
    }
  }
`;

const RegistryItem = ({ item, onClickRemove }: ImageItemProps) => {
  const { registryId, name, tags = [] } = item;

  console.log(tags);

  const _handlePressRemove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const res = confirm(`Do you want to remove the [${name}] image?`);
      if (res && onClickRemove) onClickRemove(item);
    },
    [onClickRemove]
  );

  return (
    <Link href={`/image/${registryId}/${name}`}>
      <ImageWrapper>
        <div className='item-wrapper'>
          <IconCube className='image' />
          <div className='content-wrapper'>
            <div className='name-wrapper'>
              <span className='name'>{name}</span>
            </div>
            <div className='tags-category-wrapper'>
              <IconTags />
              <span className='tags-category'>{tags.length} tags</span>
            </div>
            <div className='tags-wrapper'>
              <ul>
                {tags.map((tag) => {
                  const url = `/manifest/${registryId}/${name}/${tag}`;
                  return (
                    <li key={tag} className=''>
                      <Link href={url}>
                        <span>{tag}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <button className='remove-button' onClick={_handlePressRemove}>
          <IconTrash />
        </button>
      </ImageWrapper>
    </Link>
  );
};

export default RegistryItem;
