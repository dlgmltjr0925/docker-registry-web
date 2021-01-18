import { MouseEvent, useCallback, useState } from 'react';

import IconTag from '../../public/images/icon_tag.svg';
import { Layer } from '../../interfaces';
import styled from 'styled-components';

export interface Item {
  digest: string;
  names: string[];
  layers: Layer[];
}

interface TagWrapperProps {
  isOpened: boolean;
}

interface TagItemProps {
  item: Item;
}

const TagWrapper = styled.li<TagWrapperProps>`
  outline: none;
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

  .tags-wrapper {
    display: inline-block;

    .image {
      width: 18px;
      height: 100%;
      vertical-align: middle;
      margin-right: 5px;

      path {
        fill: #334267;
      }
    }

    .tags {
      color: #767676;
      margin-right: 5px;
      font-weight: 600;

      &::after {
        content: ',';
      }

      &:last-child::after {
        content: '';
      }
    }

    .digest {
      display: inline-block;
      margin-top: 8px;
      font-size: 13px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
  }

  .layer-wrapper {
    display: ${({ isOpened }) => (isOpened ? 'block' : 'none')};
    border-top: 1px solid #ccc;
    margin-top: 10px;
    padding-top: 10px;

    .layer {
      border: 1px solid #eee;
      padding: 10px 10px;
      font-size: 13px;
      margin-bottom: 5px;
      box-shadow: 1px 1px 3px #ccc;

      &:hover {
        background: #fcfcfc;
      }

      span {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }

      .digest {
        margin-right: 20px;
      }
    }

    .title {
      font-weight: 500;
      margin-bottom: 10px;
      margin-left: 10px;
    }
  }
`;

const TagItem = ({ item: { digest, names, layers } }: TagItemProps) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const _handlePress = useCallback(
    (e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>) => {
      e.preventDefault();
      setIsOpened(!isOpened);
    },
    [setIsOpened, isOpened]
  );

  return (
    <TagWrapper isOpened={isOpened} onClick={_handlePress}>
      <div className='tags-wrapper'>
        <div>
          <IconTag className='image' />
          {names.map((name) => {
            return (
              <span key={name} className='tags'>
                {name}
              </span>
            );
          })}
        </div>
        <span className='digest'>{`digest: ${digest}`}</span>
      </div>
      <div className='layer-wrapper'>
        <div className='title'>Layers</div>
        {layers.map((layer) => {
          return (
            <div key={layer.digest} className='layer'>
              <span className='digest'>digest: {layer.digest}</span>
              <span className='size'>size: {layer.size}</span>
            </div>
          );
        })}
      </div>
    </TagWrapper>
  );
};

export default TagItem;
