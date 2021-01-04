import '../styles/reset.css';

import Layout from '../components/Layout';
import React from 'react';

interface Props {
  Component: any;
  pageProps: any;
}

const App = ({ Component, pageProps }: Props) => {
  console.log('[Render] App', pageProps);
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
