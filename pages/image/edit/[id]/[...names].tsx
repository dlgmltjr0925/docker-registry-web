import React, { useCallback, useState } from 'react';

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

const Edit = () => {
  const router = useRouter();

  const { id, names } = router.query as Query;

  if (!id || !names) return null;

  const registryId = parseInt(id, 10);
  const name = names.join('/');

  const [url, setUrl] = useState<string>('');
  const { isUploading, setRepository } = useSetImage({ registryId, name });

  const _handleChangeUrl = useCallback(
    ({ target: { value } }) => {
      setUrl(value);
    },
    [setUrl]
  );

  const _handleClickAddButton = async () => {
    try {
      const res = await setRepository({ url });

      if (res && res.data) {
        const { status, message } = res.data;
        if (status === 200) router.push('/');
        else alert(message);
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
            value={url}
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

export default Edit;
