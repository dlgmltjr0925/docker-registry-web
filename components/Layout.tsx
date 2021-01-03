import React, { ReactNode, useEffect, useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';

type Props = {
  children?: ReactNode;
  title?: string;
};

interface WrapperProps {
  isSidebarOpened: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  #body {
    overflow: hidden;
    min-height: 100vh;
  }

  #sidebar-wrapper {
    position: relative;
    float: left;
    background: #334267;
    width: ${(props) => (props.isSidebarOpened ? '250px' : '70px')};
    min-height: inherit;
    color: #bebfdc;
    /* transition: all 0.3s ease-ease-in-out; */
  }

  #content-wrapper {
    float: left;
  }

  .sidebar-open {
    width: 250px;
  }

  .sidebar-header {
    width: 100%;
    height: 60px;
    background: #2f3f60;
  }

  .sidebar-header a {
    display: block;
    position: relative;
    width: 180px;
    padding: 5px;
    margin: auto 5px;
    color: #59bee7;
  }

  .sidebar-header a .home-logo {
    display: inline-block;
    vertical-align: bottom;
  }

  .sidebar-header a span {
    display: inline-block;
    padding: 4px 0 10px 5px;
    font-size: 18px;
  }

  .sidebar-content {
    width: 100%;
    height: 100%;
  }
`;

const Layout = ({ children, title = 'Docker Registry Web UI' }: Props) => {
  const [isSidebarOpened, setIsSidebarOpened] = useState<boolean>(true);

  return (
    <Wrapper isSidebarOpened={isSidebarOpened}>
      <Head>
        <title>{title}</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <div id='body'>
        <div id='sidebar-wrapper'>
          <div className='sidebar-header'>
            <Link href='/'>
              <a>
                <img
                  className='home-logo'
                  src='/images/home_logo.png'
                  alt='Home Logo'
                  width={50}
                  height={50}
                />
                <span>Docker Registry</span>
              </a>
            </Link>
          </div>
          <div className='sidebar-content'>sidebar-content</div>
        </div>
        <div id='content-wrapper'>
          <header></header>
          <section>{children}</section>
        </div>
      </div>
    </Wrapper>
  );
};

export default Layout;
