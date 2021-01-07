import React, { ReactNode, useCallback, useState } from 'react';

import Head from 'next/head';
import Header from './Header';
import SideBar from './SideBar';
import { getRouteType } from '../utils/router';
import styled from 'styled-components';
import { useRouter } from 'next/router';

type Props = {
  children?: ReactNode;
  title?: string;
};

interface WrapperProps {
  isOpened: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  #body {
    position: relative;
    display: flex;
    flex-direction: row;
    flex: 1;
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

    .wrapper {
      background: #ccc;
    }

    section {
      margin-top: 75px;
    }
  }
`;

const Layout = ({ children, title = 'Docker Registry Web UI' }: Props) => {
  const { route } = useRouter();

  const routeType = getRouteType(route);

  const [isOpened, setIsOpened] = useState<boolean>(true);

  const _handleClickFold = useCallback(() => {
    setIsOpened(!isOpened);
  }, [setIsOpened, isOpened]);

  return (
    <Wrapper isOpened={isOpened}>
      <Head>
        <title>{title}</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap'
          rel='stylesheet'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/images/favicon-32x32.png'
        />
      </Head>
      <div id='body'>
        <SideBar
          routeType={routeType}
          isOpened={isOpened}
          onClickFold={_handleClickFold}
        />
        <div id='content-wrapper'>
          <div className='wrapper'>
            <Header routeType={routeType} />
            <section>{children}</section>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Layout;
