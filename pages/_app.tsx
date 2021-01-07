import '../styles/global.css';
import '../styles/font.css';
import '../styles/widget.css';

import Layout from '../components/Layout';
import React from 'react';

interface Props {
  Component: any;
  pageProps: any;
}

const App = ({ Component, pageProps }: Props) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
