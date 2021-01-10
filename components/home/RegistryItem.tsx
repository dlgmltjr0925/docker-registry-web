import React, { useCallback, useMemo } from 'react';

import IconCubes from '../../public/images/icon_cubes.svg';
import IconTrash from '../../public/images/icon_trash.svg';
import ImageDockerRegistry from '../../public/images/image_docker_registry.svg';
import Link from 'next/link';
import { Registry } from '../../interfaces';
import dateFormat from 'dateformat';
import styled from 'styled-components';

interface RegistryItemProps {
  item: Registry;
  checkedDate?: string;
  onClickRemove: (id: number) => void;
}

interface RegistryWrapperProps {
  status: boolean;
}

const RegistryWrapper = styled.li<RegistryWrapperProps>`
  position: relative;
  margin: 10px 5px 20px;
  padding: 10px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  cursor: pointer;
  box-shadow: 1px 1px 3px #ccc;
  border-radius: 3px;
  overflow: hidden;

  .item-wrapper {
    display: inline-block;
    .image {
      width: 70px;
      height: 100%;
      vertical-align: top;
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
          background: ${({ status }) => (status ? '#74b566' : '#c95c54')};
        }

        .date {
          margin-left: 8px;
          color: #777;
          font-size: 14px;
        }
      }

      .summary-wrapper {
        margin-top: 10px;

        .url {
          font-size: 16px;
          font-weight: 500;
          color: #777;
        }

        .image-wrapper {
          font-size: 15px;
          margin-left: 10px;
          font-weight: 500;

          svg {
            display: inline-block;
            width: 15px;
            height: 100%;
            margin-right: 10px;
            vertical-align: top;
          }

          &::after {
            content: ' images';
          }
        }
      }

      .images-wrapper {
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

const RegistryItem = ({ item, onClickRemove }: RegistryItemProps) => {
  const { id, name, url, images = [], status = false, checkedDate } = item;

  const date = useMemo(() => {
    if (!checkedDate) return '';
    const date = new Date(checkedDate);
    return dateFormat(date, 'yyyy-mm-dd h:MM:ss');
  }, [checkedDate]);

  const _handlePressRemove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const res = confirm(`Do you want to remove the [${name}] registry?`);
      if (res && onClickRemove) onClickRemove(id);
    },
    [onClickRemove]
  );

  return (
    <Link href={`/dashboard/${id}`}>
      <RegistryWrapper status={status}>
        <div className='item-wrapper'>
          <ImageDockerRegistry className='image' />
          <div className='content-wrapper'>
            <div className='name-wrapper'>
              <span className='name'>{name}</span>
              <span className='status'>{status ? 'up' : 'down'}</span>
              <span className='date'>{date}</span>
            </div>
            <div className='summary-wrapper'>
              <span className='url'>{url}</span>
              <span className='image-wrapper'>
                <IconCubes />
                {images.length}
              </span>
            </div>
            <div className='images-wrapper'>
              <ul>
                {images.map(({ name }) => {
                  const url = `/image/${id}/${name}`;
                  return (
                    <li key={name} className=''>
                      <Link href={url}>
                        <span>{name}</span>
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
      </RegistryWrapper>
    </Link>
  );
};

export default RegistryItem;
