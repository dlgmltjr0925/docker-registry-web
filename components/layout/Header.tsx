import React, { useMemo } from 'react';

import Link from 'next/link';
import { Subtitle } from '../../utils/router';
import styled from 'styled-components';

interface HeaderProps {
  title: string;
  subtitles: Subtitle[];
}

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  background: #fff;
  margin-bottom: 15px;

  .title-wrapper {
    padding-top: 7px;
    padding-left: 15px;

    .title {
      font-size: 17px;
      line-height: 150%;
      font-weight: 500;
      color: #333;
    }

    .subtitle {
      margin-top: 2px;
      font-size: 10px;
      font-weight: 600;

      span {
        color: #333;
      }

      a {
        color: #337ab7;
        text-decoration: none;
      }

      a:hover {
        color: #23527c;
        text-decoration: underline;
      }
    }
  }
`;

const getSubTitle = (subtitles: Subtitle[]): JSX.Element[] | null => {
  return subtitles.map(({ name, url }, index) => {
    return (
      <React.Fragment key={name}>
        {index !== 0 && (
          <span className='link'>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</span>
        )}
        {url ? (
          <Link href={url}>
            <a>{name}</a>
          </Link>
        ) : (
          <span>{name}</span>
        )}
      </React.Fragment>
    );
  });
};

const Header = ({ title, subtitles }: HeaderProps) => {
  const subTitle = useMemo(() => {
    return getSubTitle(subtitles);
  }, [subtitles]);

  return (
    <HeaderWrapper>
      <div className='title-wrapper'>
        <p className='title'>{title}</p>
        <div className='subtitle'>{subTitle}</div>
      </div>
    </HeaderWrapper>
  );
};

export default Header;
