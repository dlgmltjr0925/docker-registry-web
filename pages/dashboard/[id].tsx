import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

interface WrapperProps {}

const Wrapper = styled.div<WrapperProps>``;

const Dashboard = () => {
  const route = useRouter();

  return (
    <Wrapper>
      <div>{route.query.id}</div>
      <div>dashboard</div>
    </Wrapper>
  );
};

export default Dashboard;
