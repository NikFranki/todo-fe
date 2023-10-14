import React from 'react';

import { Layout, Space } from 'antd';
import dayjs from 'dayjs';

import Menu from '../components/menu';
import Todo from './todo';
import SiderBar from '../components/sider-bar';

const { Header, Footer, Sider, Content } = Layout;

const headerStyle = {
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
};
const siderStyle = {
  flex: '0 0 300px',
  maxWidth: '300px',
  minWidth: '200px',
  width: '300px',
  textAlign: 'left',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#3ba0e9',
};
const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#f5f5d5',
};
const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#7dbcea',
};

function Home() {
  return (
    <div className="App">
      <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
        <Layout>
          <Header style={headerStyle}>
            <span>Todo</span>
            <Menu />
          </Header>
          <Layout>
            <Sider className="menu-side-bar" style={siderStyle}>
              <SiderBar />
            </Sider>
            <Content style={contentStyle}>
              <Todo />
            </Content>
          </Layout>
          <Footer style={footerStyle}>@Copyright reserved by franki & christ {dayjs().format('YYYY')}</Footer>
        </Layout>
      </Space>
    </div>
  );
}

export default Home;
