import Link from 'next/link';
import { Registry } from '../interfaces';
import axios from 'axios';
import styled from 'styled-components';
import { useState } from 'react';

const Wrapper = styled.div`
  width: 100%;
  padding: 0;

  .registry-list {
    list-style: none;
    padding: 0;

    li {
      border: 1px solid #ccc;

      p {
        height: 500px;
      }
    }
  }
`;

const Index = ({ ...props }) => {
  const [registries] = useState<Registry[]>(props.registries);

  return (
    <Wrapper>
      <ul className='registry-list'>
        {registries.map(({ id, name, host }) => (
          <li key={`${id}-${name}`}>
            <Link href='#'>
              <p>{host}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};

export const getServerSideProps = async () => {
  const props = {
    registries: [],
  };

  try {
    const res = await axios.get('http://localhost:3000/api/registry');

    if (res && res.data) {
      props.registries = res.data;
    }
  } catch (error) {
    console.log(error);
  }

  return {
    props,
  };
};

export default Index;
