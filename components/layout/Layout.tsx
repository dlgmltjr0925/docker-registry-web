import React, { ReactNode, useCallback, useState } from 'react';

import Head from 'next/head';
import Header from './Header';
import SideBar from './SideBar';
import { getLayoutInfo } from '../../utils/router';
import styled from 'styled-components';
import { useRouter } from 'next/router';

type Props = {
  children?: ReactNode;
};

interface WrapperProps {
  isOpened: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  #body {
    position: relative;
    min-height: 100vh;
    background: #f3f3f3;
  }

  #content-wrapper {
    float: left;
  }

  #content-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding-left: ${({ isOpened }) => (isOpened ? '250px' : '70px')};
    min-height: 100vh;
    transition: padding-left 0.5s ease-in-out;

    section {
      margin-top: 75px;
      width: 100%;
    }
  }
`;

const Layout = ({ children }: Props) => {
  const router = useRouter();

  const { title, subtitles, sideTabs } = getLayoutInfo(router);

  const [isOpened, setIsOpened] = useState<boolean>(true);

  const _handleClickFold = useCallback(() => {
    setIsOpened(!isOpened);
  }, [setIsOpened, isOpened]);

  return (
    <Wrapper isOpened={isOpened}>
      <Head>
        <title>Docker Registry Web</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/images/favicon-32x32.png'
        />
        <link rel='stylesheet' href='github-markdown.css' />
      </Head>
      <div id='body'>
        <SideBar
          tabs={sideTabs}
          isOpened={isOpened}
          onClickFold={_handleClickFold}
        />
        <div id='content-wrapper'>
          <div className='wrapper'>
            <Header title={title} subtitles={subtitles} />
            <section>{children}</section>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Layout;
