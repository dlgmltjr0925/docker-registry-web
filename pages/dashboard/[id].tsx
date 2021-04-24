import React, { useEffect } from 'react';

import { ApiResult } from '../../interfaces/api';
import { GetServerSidePropsContext } from 'next';
import IconDashboard from '../../public/images/icon_dashboard.svg';
import { Registry } from '../../interfaces';
import axios from 'axios';
import dateFormat from 'dateformat';
import styled from 'styled-components';
import { useRouter } from 'next/router';

interface WrapperProps {}

interface DashboardProps {
  registry?: Registry;
}

const Wrapper = styled.div<WrapperProps>`
  .widget-row-wrapper {
    border-top: 1px solid #ccc;

    span {
      font-size: 13px;
      line-height: 1.42857143;
      color: #333;
      font-weight: 600;
    }

    .category-wrapper {
      display: inline-block;
      width: 20%;
    }

    .content-wrapper {
      display: inline-block;
      width: 80%;
    }
  }
`;

const Dashboard = ({ registry }: DashboardProps) => {
  const router = useRouter();

  useEffect(() => {
    if (!registry) router.push('/');
  }, [registry]);

  if (!registry) return null;

  return (
    <Wrapper>
      <div className='widget-wrapper'>
        <div className='widget-header-wrapper'>
          <div className='header-title'>
            <IconDashboard className='header-icon' />
            <span>Endpoint Info</span>
          </div>
        </div>
        {/* Name */}
        <div className='widget-row-wrapper'>
          <div className='category-wrapper'>
            <span>Name</span>
          </div>
          <div className='content-wrapper'>
            <span>{registry.name}</span>
          </div>
        </div>
        {/* URL */}
        <div className='widget-row-wrapper'>
          <div className='category-wrapper'>
            <span>URL</span>
          </div>
          <div className='content-wrapper'>
            <span>{registry.url}</span>
          </div>
        </div>
        {/* Status */}
        <div className='widget-row-wrapper'>
          <div className='category-wrapper'>
            <span>Status</span>
          </div>
          <div className='content-wrapper'>
            <span>{`${registry.status ? 'UP' : 'DOWN'}`}</span>
            <span>
              {` <${dateFormat(registry.checkedDate, 'yyyy-mm-dd hh:MM:ss')}>`}
            </span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export const getServerSideProps = async ({
  query: { id },
}: GetServerSidePropsContext) => {
  const props: Partial<DashboardProps> = {};

  try {
    const result = await axios.get<ApiResult<Registry>>(
      `http://${process.env.host}:${process.env.port}/api/registry/${id}`
    );

    if (result && result.data) {
      const { status, data } = result.data;
      if (status === 200) props['registry'] = data;
    }
  } catch (error) {
    console.log(error);
  }

  return {
    props,
  };
};

export default Dashboard;
