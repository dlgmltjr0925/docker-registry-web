import React, { useCallback } from 'react';

import styled from 'styled-components';

interface SwitchWrapperProps {
  value: boolean;
}

interface SwitchProps {
  value: boolean;
  onClick?: (toggleValue: boolean) => void;
}

const SwitchWrapper = styled.div<SwitchWrapperProps>`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  border-radius: 12px;
  border: 1px solid #aaa;
  box-sizing: border-box;
  cursor: pointer;
  box-shadow: inset 0 0 1px #ccc;

  .bg-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    overflow: hidden;

    .bg {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: #80a4ca;
      transition: transform 0.2s ease-in-out;
      transform: translateX(${({ value }) => (value ? '100%' : '0')});
    }
  }

  .circle {
    position: absolute;
    top: -2px;
    left: -2px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 1px solid #ccc;
    background: #fff;
    box-sizing: border-box;
    transition: transform 0.2s ease-in-out;
    transform: translateX(${({ value }) => (value ? '24px' : '0')});
  }
`;

const Switch = ({ value, onClick }: SwitchProps) => {
  const _handleClick = useCallback(() => {
    if (onClick) onClick(!value);
  }, [value, onClick]);

  return (
    <SwitchWrapper value={value} onClick={_handleClick}>
      <div className='bg-wrapper'>
        <div className='bg' />
      </div>
      <div className='circle' />
    </SwitchWrapper>
  );
};

export default Switch;
