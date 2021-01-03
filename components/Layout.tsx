import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import {
  faCube,
  faExchangeAlt,
  faHome,
  faLayerGroup,
  faPlug,
  faTags,
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';

type Props = {
  children?: ReactNode;
  title?: string;
};

interface WrapperProps {
  isOpened: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  #body {
    overflow: hidden;
    min-height: 100vh;
  }

  #sidebar-wrapper {
    position: relative;
    overflow: hidden;
    float: left;
    background: #334267;
    width: 250px;
    min-height: inherit;
    color: #bebfdc;
    transition: all 0.5s ease-in-out;
    transform: translateX(${({ isOpened }) => (isOpened ? '0' : '-180px')});
  }

  #content-wrapper {
    float: left;
  }

  .sidebar-header {
    position: relative;
    width: 100%;
    height: 60px;
    background: #2f3f60;
  }

  .sidebar-header a {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    width: 180px;
    padding: 5px;
    color: #59bee7;
    transition: all 0.3s 0.2s ease-in-out;
    transform: translateX(${({ isOpened }) => (isOpened ? '0' : '-180px')});
  }

  .sidebar-header a .home-logo {
    display: inline-block;
    vertical-align: bottom;
  }

  .sidebar-header a span {
    display: inline-block;
    padding: 4px 0 10px 5px;
    font-size: 16px;
    letter-spacing: -0.5px;
  }

  .sidebar-header .exchange-btn {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    width: 70px;
    height: 60px;
    color: #bebfdc;
    text-align: center;

    .icon {
      width: 27px;
      height: 60px;
      font-size: 23px;
    }

    &:hover {
      cursor: pointer;

      .icon {
        color: #fff;
      }
    }
  }

  .sidebar-content {
    width: 100%;
    height: 100%;

    .side-element {
      position: relative;
      width: 100%;
      height: 30px;
      border-left: 3px solid transparent;
      cursor: pointer;

      &:hover {
        border-left: 3px solid #e99d1a;
        color: #fff;
        font-weight: bold;
        background: #2f3f60;
      }

      span {
        font-size: 12px;
        font-weight: bold;
        text-transform: capitalize;
        line-height: 30px;
        margin-left: 20px;
      }

      .icon-wrapper {
        position: absolute;
        top: 0;
        right: 0;
        width: 70px;
        height: 30px;

        .icon {
          width: 16px;
          height: 100%;
          display: block;
          margin: auto;
        }
      }
    }

    .side-connect {
      position: relative;
      width: 100%;
      height: 30px;
      margin-left: 13px;
      color: #fff;

      .icon-wrapper {
        display: inline-block;
        width: 20px;

        .icon {
          width: 10px;
        }
      }

      span {
        display: inline-block;
        font-size: 12px;
        line-height: 30px;
        text-transform: uppercase;
      }
    }
  }
`;

const Layout = ({ children, title = 'Docker Registry Web UI' }: Props) => {
  const [isOpened, setIsOpened] = useState<boolean>(true);

  const _handleClickExchangeBtn = useCallback(() => {
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
          href='https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap'
          rel='stylesheet'
        />
      </Head>
      <div id='body'>
        <div id='sidebar-wrapper'>
          {/* 사이드바 헤더 */}
          <div className='sidebar-header'>
            <Link href='/'>
              <a>
                <img
                  className='home-logo'
                  src='/images/home_logo.png'
                  alt='Home Logo'
                  width={45}
                  height={45}
                />
                <span>Docker Registry</span>
              </a>
            </Link>
            <div className='exchange-btn' onClick={_handleClickExchangeBtn}>
              <FontAwesomeIcon className='icon' icon={faExchangeAlt} />
            </div>
          </div>
          {/* 사이드바 컨텐츠 */}
          <div className='sidebar-content'>
            <div className='side-element'>
              <span>home</span>
              <div className='icon-wrapper'>
                <FontAwesomeIcon className='icon' icon={faHome} />
              </div>
            </div>
            {/* 연결된 레지스트리 */}
            {isOpened && (
              <div className='side-connect'>
                <div className='icon-wrapper'>
                  <FontAwesomeIcon className='icon' icon={faPlug} />
                </div>
                <span>temp-docker-register</span>
              </div>
            )}
            <div className='side-element side-home'>
              <span>arm64v8</span>
              <div className='icon-wrapper'>
                <FontAwesomeIcon className='icon' icon={faCube} />
              </div>
            </div>
            <div className='side-element side-home'>
              <span>tags</span>
              <div className='icon-wrapper'>
                <FontAwesomeIcon className='icon' icon={faTags} />
              </div>
            </div>
            <div className='side-element side-home'>
              <span>manifest</span>
              <div className='icon-wrapper'>
                <FontAwesomeIcon className='icon' icon={faLayerGroup} />
              </div>
            </div>
            <div className='side-element side-home'>
              <span>nginx</span>
              <div className='icon-wrapper'>
                <FontAwesomeIcon className='icon' icon={faCube} />
              </div>
            </div>
            <div className='side-element side-home'>
              <span>kafka</span>
              <div className='icon-wrapper'>
                <FontAwesomeIcon className='icon' icon={faCube} />
              </div>
            </div>
            <div className='side-element side-home'>
              <span>mysql</span>
              <div className='icon-wrapper'>
                <FontAwesomeIcon className='icon' icon={faCube} />
              </div>
            </div>
          </div>
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
