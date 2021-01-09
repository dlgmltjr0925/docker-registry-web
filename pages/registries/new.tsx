import React, { useCallback, useState } from 'react';

import IconWarning from '../../public/images/icon_warning.svg';
import Switch from '../../components/Switch';
import styled from 'styled-components';

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
      padding: 6px 12pxl;
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

const New = () => {
  const [name, setName] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [hasAuth, setHasAuth] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const _handleChangeName = useCallback(
    ({ target: { value } }) => {
      setName(value);
    },
    [setName]
  );

  const _handleChangeUrl = useCallback(
    ({ target: { value } }) => {
      setUrl(value);
    },
    [setUrl]
  );

  const _handleChangeUsername = useCallback(
    ({ target: { value } }) => {
      setUsername(value);
    },
    [setUsername]
  );

  const _handleChangePassword = useCallback(
    ({ target: { value } }) => {
      setPassword(value);
    },
    [setPassword]
  );

  const buttonDisabled =
    name.trim() === '' ||
    url.trim() === '' ||
    (hasAuth && (username.trim() === '' || password.trim() === ''));

  return (
    <div className='widget-wrapper'>
      <Wrapper>
        {/* 레지스트리 이름 */}
        <div className='input-wrapper'>
          <label className='input-category'>Name</label>
          <input type='text' value={name} onChange={_handleChangeName} />
        </div>
        {name.trim() === '' && (
          <span className='require'>
            <IconWarning className='icon' />
            This field is required.
          </span>
        )}
        {/* 레지스트리 URL */}
        <div className='input-wrapper'>
          <label className='input-category'>Registry URL</label>
          <input type='text' value={url} onChange={_handleChangeUrl} />
        </div>
        {url.trim() === '' && (
          <span className='require'>
            <IconWarning className='icon' />
            This field is required.
          </span>
        )}
        {/* 인증 */}
        <div className='input-wrapper'>
          <div className='row'>
            <label className='input-category'>Authentication</label>
            <Switch
              value={hasAuth}
              onClick={(value) => {
                setHasAuth(value);
              }}
            />
          </div>
        </div>
        {hasAuth && (
          <>
            <div className='input-wrapper'>
              <label className='input-category'>Username</label>
              <input
                type='text'
                value={username}
                onChange={_handleChangeUsername}
              />
            </div>
            {username.trim() === '' && (
              <span className='require'>
                <IconWarning className='icon' />
                This field is required.
              </span>
            )}
            <div className='input-wrapper'>
              <label className='input-category'>Password</label>
              <input
                type='password'
                value={password}
                onChange={_handleChangePassword}
              />
            </div>
            {password.trim() === '' && (
              <span className='require'>
                <IconWarning className='icon' />
                This field is required.
              </span>
            )}
          </>
        )}
        <div className='input-wrapper'>
          <button disabled={buttonDisabled} className='button button-blue'>
            Add registry
          </button>
        </div>
      </Wrapper>
    </div>
  );
};

export default New;
