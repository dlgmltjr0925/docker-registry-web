import { useCallback, useMemo, useState } from 'react';

import IconConnect from '../public/images/icon_connect.svg';
import IconPlus from '../public/images/icon_plus.svg';
import IconSearch from '../public/images/icon_search.svg';
import Link from 'next/link';
import { Registry } from '../interfaces';
import RegistryItem from '../components/home/RegistryItem';
import axios from 'axios';
import styled from 'styled-components';

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

const Home = ({ ...props }: HomeProps) => {
  const [registries, setRegistries] = useState<Registry[]>(props.registries);
  const [keyword, setKeyword] = useState<string>('');

  const _handleChangeKeyword = useCallback(
    ({ target: { value } }) => {
      setKeyword(value);
    },
    [setKeyword]
  );

  const _handleClickRemoveRegistry = useCallback(
    async (registryId: number) => {
      try {
        const res = await axios.delete(
          `${window.location.origin}/api/registry/${registryId}`
        );

        if (res && res.data) {
          const { status, message } = res.data;
          if (status === 200) {
            setRegistries(registries.filter(({ id }) => registryId !== id));
          } else {
            alert(message);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [registries, setRegistries]
  );

  const filteredRegistries = useMemo(() => {
    if (keyword.trim() === '') return registries;
    try {
      const regExps = keyword
        .trim()
        .split(' ')
        .map((keyword) => new RegExp(keyword));
      return registries.filter(({ name, url, images = [] }) => {
        for (let regExp of regExps) {
          if (
            regExp.test(name) ||
            regExp.test(url) ||
            images.findIndex(({ name }) => regExp.test(name)) !== -1
          )
            return true;
        }
        return false;
      });
    } catch (error) {
      return registries;
    }
  }, [keyword, registries]);

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
          <Link href='/registries/new'>
            <button className='button button-blue' type='button'>
              <IconPlus className='button-icon' />
              Add registry
            </button>
          </Link>
        </div>
        <div className='widget-row-wrapper search-wrapper'>
          <IconSearch className='search-icon' />
          <input
            type='text'
            placeholder='Search by name, url, image name...'
            value={keyword}
            onChange={_handleChangeKeyword}
          />
        </div>
        <div className='widget-row-wrapper'>
          {filteredRegistries.length === 0 ? (
            <p className='empty-content'>No endpoint available</p>
          ) : (
            <ul>
              {registries.map((registry) => (
                <RegistryItem
                  key={`${registry.id}`}
                  item={registry}
                  onClickRemove={_handleClickRemoveRegistry}
                />
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
  }

  return {
    props,
  };
};

export default Home;
