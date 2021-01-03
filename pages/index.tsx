import Link from 'next/link';
import { Registry } from '../interfaces';
import axios from 'axios';
import styled from 'styled-components';
import { useState } from 'react';

const Wrapper = styled.div`
  width: 1288px;
  padding: 0;

  .registry-list {
    list-style: none;
    padding: 0;

    li {
      border: 1px solid #ccc;
    }
  }
`;

const Index = ({ ...props }) => {
  const [registries, setRegistries] = useState<Registry[]>(props.registries);

  return (
    <Wrapper>
      <ul className='registry-list'>
        {registries.map(({ host }) => (
          <li key={host}>
            <Link href={host}>
              <span>{host}</span>
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
    const res = await axios.get('http://localhost:3000/api/registries');

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
