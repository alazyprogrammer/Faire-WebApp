import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

const Home = () => {
  return (
    <Layout style={{ padding: '0 24px 24px' }}>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {/* Add content for the home page here */}
          <h1>Welcome to Faire!</h1>
          <p>This is the home page content.</p>
        </Content>
      </Layout>
  );
};

export default Home;
