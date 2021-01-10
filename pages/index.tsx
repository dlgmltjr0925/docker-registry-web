import IconConnect from '../public/images/icon_connect.svg';
import IconCubes from '../public/images/icon_cubes.svg';
import IconPlus from '../public/images/icon_plus.svg';
import IconSearch from '../public/images/icon_search.svg';
import IconTrash from '../public/images/icon_trash.svg';
import ImageDockerRegistry from '../public/images/image_docker_registry.svg';
import Link from 'next/link';
import { Registry } from '../interfaces';
import axios from 'axios';
import styled from 'styled-components';
import { useState } from 'react';

interface HomeProps {
  registries: Registry[];
  checkedDate?: string;
}

const Wrapper = styled.div`
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

const RegistryWrapper = styled.div`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  box-sizing: border-box;
`;

const Home = ({ ...props }: HomeProps) => {
  const [registries] = useState<Registry[]>(props.registries);

  return (
    <Wrapper>
      <div className='widget-wrapper'>
        <div className='widget-header-wrapper'>
          <div className='header-title'>
            <IconConnect className='header-icon' />
            <span>Registries</span>
          </div>
        </div>
        <div className='widget-row-wrapper'>
          <button
            disabled
            className='button button-red'
            type='button'
            onClick={() => {
              console.log('onClick');
            }}
          >
            <IconTrash className='button-icon' />
            Remove
          </button>
          <Link href='/registries/new'>
            <button className='button button-blue' type='button'>
              <IconPlus className='button-icon' />
              Add registry
            </button>
          </Link>
        </div>
        <div className='widget-row-wrapper search-wrapper'>
          <IconSearch className='search-icon' />
          <input type='text' />
        </div>
        <div className='widget-row-wrapper'>
          {registries.length === 0 ? (
            <p className='empty-content'>No endpoint available</p>
          ) : (
            <ul>
              {registries.map(({ id, name, url, images = [] }) => (
                <li key={`${id}-${name}`}>
                  <Link href='#'>
                    <RegistryWrapper>
                      <div>
                        <ImageDockerRegistry />
                      </div>
                      <div>
                        <div>
                          <span>{name}</span>
                          <span>{'up'}</span>
                          {/* <span>{new Date().toString()}</span> */}
                        </div>
                        <div>
                          <span>{url}</span>
                          <span>
                            <IconCubes />
                            {images.length}
                            &nbsp;images
                          </span>
                        </div>
                        <div>
                          <ul>
                            {images.map(({ name }) => {
                              const url = `/image/${id}/${name}`;
                              return (
                                <li key={name}>
                                  <Link href={url}>
                                    <span>{name}</span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </RegistryWrapper>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export const getServerSideProps = async () => {
  const props: Partial<HomeProps> = {
    registries: [],
  };

  try {
    const res = await axios.get('http://localhost:3000/api/registries');

    if (res && res.data) {
      const { data } = res.data;
      props.registries = data.registries;
    }
  } catch (error) {
    console.log(error);
  } finally {
    props.checkedDate = new Date().toString();
  }

  return {
    props,
  };
};

export default Home;
