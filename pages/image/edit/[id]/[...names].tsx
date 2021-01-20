import React, { useCallback, useState } from 'react';

import { ApiResult } from '../../../../interfaces/api';
import { GetServerSidePropsContext } from 'next';
import { Image } from '../../../../interfaces';
import axios from 'axios';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useSetImage } from '../../../../hooks/image';

interface WrapperProps {}

const Wrapper = styled.div<WrapperProps>`
  padding: 20px;

  .input-wrapper {
    display: inline-block;
    width: 100%;
    margin-bottom: 20px;

    label {
      display: inline-block;
      width: 20%;
      padding: 7px 15px 0 0;
      font-size: 13px;
      color: #333;
      font-weight: 600;
    }

    input {
      display: inline-block;
      width: 50%;
      height: 34px;
      padding: 6px 12px;
      background: #fff;
      border: 1px solid #ccc;
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
      font-size: 14px;
      line-height: 1.42857143;
      color: #555;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
        -webkit-box-shadow 0.15s ease-in-out;
    }

    input::placeholder {
      color: #999;
      font-weight: 500;
    }

    input:focus {
      outline: none;
      border-color: #66afe9;
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
        0 0 8px rgba(102, 175, 233, 0.6);
    }
  }

  .require {
    display: inline-block;
    font-size: 85%;
    color: #f0ad4e;
    padding-bottom: 20px;
    font-weight: 500;

    .icon {
      width: 10px;
      height: 10px;
      margin-right: 5px;

      path {
        fill: #f0ad4e;
      }
    }
  }
`;

interface Query extends Record<string, string | string[]> {
  id: string;
  names: string[];
}

interface EditProps {
  image?: Image;
}

const Edit = ({ image }: EditProps) => {
  const router = useRouter();

  const { id, names } = router.query as Query;

  if (!id || !names) return null;

  const registryId = parseInt(id, 10);
  const name = names.join('/');

  const [repositoryUrl, setRepositoryUrl] = useState<string>(
    image?.sourceRepositryUrl || ''
  );
  const { isUploading, setRepository } = useSetImage({ registryId, name });

  const _handleChangeUrl = useCallback(
    ({ target: { value } }) => {
      setRepositoryUrl(value);
    },
    [setRepositoryUrl]
  );

  const _handleClickAddButton = async () => {
    try {
      const res = await setRepository({ repositoryUrl });

      if (res && res.data) {
        const { status, message } = res.data;
        if (status === 200) {
          router.push(`/image/${id}/${names}`);
        } else {
          alert(message);
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className='widget-wrapper'>
      <Wrapper>
        {/* 소스 repository URL */}
        <div className='input-wrapper'>
          <label className='input-category'>Repository URL</label>
          <input
            type='text'
            placeholder='https://github.com/user/registry-docker-ui'
            value={repositoryUrl}
            onChange={_handleChangeUrl}
          />
        </div>
        <div className='input-wrapper'>
          <button
            className='button button-blue'
            onClick={_handleClickAddButton}
          >
            {isUploading ? 'In progress...' : 'Save'}
          </button>
        </div>
      </Wrapper>
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const props: Partial<EditProps> = {};

  const { id, names } = context.query as { id: string; names: string[] };

  const name = names.join('/');

  const res = await axios.get<ApiResult<Image>>(
    `http://${process.env.host}:${process.env.port}/api/image/${id}/${name}`
  );

  if (res && res.data) {
    const { status, data } = res.data;
    if (status === 200) props.image = data as Image;
  }

  return {
    props,
  };
};

export default Edit;
