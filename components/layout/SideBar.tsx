import React, { useCallback, useEffect, useState } from 'react';
import { SideTab, SideTabType } from '../../utils/router';

import { ApiResult } from '../../interfaces/api';
import IconConnect from '../../public/images/icon_connect.svg';
import IconCube from '../../public/images/icon_cube.svg';
import IconCubes from '../../public/images/icon_cubes.svg';
import IconDashboard from '../../public/images/icon_dashboard.svg';
import IconExchange from '../../public/images/icon_exchange.svg';
import IconHome from '../../public/images/icon_home.svg';
import IconTags from '../../public/images/icon_tags.svg';
import Link from 'next/link';
import { Registry } from '../../interfaces';
import axios from 'axios';
import styled from 'styled-components';
import { useRouter } from 'next/router';

interface SideBarProps {
  isOpened: boolean;
  onClickFold: () => void;
  tabs: SideTab[];
}

interface SideBarWrapperProps {
  isOpened: boolean;
}

const SideBarWrapper = styled.div<SideBarWrapperProps>`
  position: fixed;
  z-index: 2;
  background: #334267;
  width: 250px;
  min-height: inherit;
  color: #bebfdc;
  transition: transform 0.5s ease-in-out;
  transform: translateX(${({ isOpened }) => (isOpened ? '0' : '-180px')});
  overflow: hidden;

  .sidebar-header {
    position: relative;
    width: 100%;
    height: 60px;
    background: #2f3f60;

    a {
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      width: 180px;
      padding: 5px;
      color: #59bee7;
      transition: transform 0.3s 0.2s ease-in-out;

      .home-logo {
        display: inline-block;
        vertical-align: bottom;
      }

      span {
        display: inline-block;
        padding: 4px 0 10px 5px;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: -0.5px;
      }
    }

    .exchange-btn {
      display: inline-block;
      position: absolute;
      top: 0;
      right: 0;
      width: 70px;
      height: 60px;
      text-align: center;

      .icon {
        margin-top: 20px;
        width: 20px;
        height: 20px;

        path {
          fill: #bebfdc;
        }
      }

      &:hover {
        cursor: pointer;

        .icon path {
          fill: #fff;
        }
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
      box-sizing: border-box;

      &:hover {
        border-left: 3px solid #e99d1a;
        color: #fff;
        font-weight: bold;
        background: #2f3f60;
      }

      &.active {
        border-left: 3px solid #fff;
        color: #fff;
        font-weight: 600;
        background: #2f3f60;

        .icon-wrapper .icon path {
          fill: #fff;
        }
      }

      span {
        font-size: 15px;
        line-height: 30px;
        margin-left: 20px;

        &.sub {
          margin-left: 35px;
        }
      }

      .icon-wrapper {
        position: absolute;
        top: 0;
        right: 0;
        width: 70px;
        height: 30px;

        .icon {
          display: block;
          margin: auto;
          width: 18px;
          height: 30px;

          path {
            fill: #bebfdc;
          }
        }

        &:hover {
          .icon path {
            fill: #fff;
          }
        }
      }
    }

    .connect-wrapper {
      width: 100%;
      height: 30px;
      color: #fff;
      text-align: center;

      .icon-wrapper {
        display: inline-block;
        width: 20px;
        height: 30px;
        margin-right: 10px;
        border-width: 1;
        vertical-align: middle;

        .icon {
          width: 18px;
          height: 30px;

          path {
            fill: #fff;
          }
        }
      }

      span {
        font-size: 12px;
        line-height: 26px;
        font-weight: bold;
      }
    }

    .image-wrapper {
      padding-top: 10px;
    }
  }
`;

interface getActiveClassArgs {
  type: SideTabType;
  options?: Record<string, unknown>;
  tabs: SideTab[];
}

const getActiveClass = ({
  type,
  options = {},
  tabs,
}: getActiveClassArgs): string => {
  const tab = tabs.find((tab) => {
    if (tab.type !== type) return false;
    for (let key in options) {
      if (tab.options && options[key] !== tab.options[key]) return false;
    }
    return true;
  });

  return tab ? ' active' : '';
};

const SideBar = ({ isOpened, onClickFold, tabs }: SideBarProps) => {
  const [registry, setRegistry] = useState<Registry | null>(null);
  const { query } = useRouter();

  const _getActiveClass = useCallback(
    (args: Omit<getActiveClassArgs, 'tabs'>) => {
      return getActiveClass({ ...args, tabs });
    },
    [tabs]
  );

  const _getRegistry = useCallback(
    async (id: string) => {
      try {
        const res = await axios.get<ApiResult<Registry>>(
          `${window.location.origin}/api/registry/${id}`
        );

        if (res && res.data) {
          const { status, message, data } = res.data;
          if (status === 200) setRegistry(data);
          else alert(message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [setRegistry]
  );

  useEffect(() => {
    const registryId = query.id as string | undefined;
    if (registryId && (!registry || `${registry.id}` !== registryId)) {
      _getRegistry(registryId);
    }
  }, [query.id]);

  return (
    <SideBarWrapper isOpened={isOpened}>
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
        <div className='exchange-btn' onClick={onClickFold}>
          <IconExchange className='icon' />
        </div>
      </div>
      {/* 사이드바 컨텐츠 */}
      <div className='sidebar-content'>
        <Link href='/'>
          <div className={`side-element${_getActiveClass({ type: 'home' })}`}>
            <span>home</span>
            <div className='icon-wrapper'>
              <IconHome className='icon' />
            </div>
          </div>
        </Link>
        {/* 연결된 레지스트리 */}
        {registry !== null && (
          <>
            {isOpened && (
              <div className='connect-wrapper'>
                <div className='icon-wrapper'>
                  <IconConnect className='icon' />
                </div>
                <span>{registry.name}</span>
              </div>
            )}
            <Link href={`/dashboard/${registry.id}`}>
              <div
                className={`side-element${_getActiveClass({
                  type: 'dashboard',
                })}`}
              >
                <span>Dashboard</span>
                <div className='icon-wrapper'>
                  <IconDashboard className='icon' />
                </div>
              </div>
            </Link>
            <Link href={`/images/${registry.id}`}>
              <div
                className={`side-element${_getActiveClass({ type: 'images' })}`}
              >
                <span>Images</span>
                <div className='icon-wrapper'>
                  <IconCubes className='icon' />
                </div>
              </div>
            </Link>
            <ul className='image-wrapper'>
              {registry.images?.map(({ name }) => {
                const visible =
                  _getActiveClass({
                    type: 'image',
                    options: { name },
                  }) !== '';
                return (
                  <li key={name}>
                    <Link href={`/image/${registry.id}/${name}`}>
                      <div
                        className={`side-element${_getActiveClass({
                          type: 'image',
                          options: { name },
                        })}`}
                      >
                        <span>{name}</span>
                        <div className='icon-wrapper'>
                          <IconCube className='icon' />
                        </div>
                      </div>
                    </Link>
                    {visible && (
                      <Link href={`/tags/${registry.id}/${name}`}>
                        <div
                          className={`side-element${_getActiveClass({
                            type: 'tags',
                            options: { name },
                          })}`}
                        >
                          <span className='sub'>tags</span>
                          <div className='icon-wrapper'>
                            <IconTags className='icon' />
                          </div>
                        </div>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </SideBarWrapper>
  );
};

export default SideBar;
