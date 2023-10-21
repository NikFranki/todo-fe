import React from 'react';

import { Layout, Space, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import _ from 'lodash';

import Menu from '../components/menu';
import Todo from './todo';
import SiderBar from '../components/sider-bar';
import useContextInfo from '../hooks/use-context-info';

import "./home.css";

const { Header, Footer, Sider, Content } = Layout;

const headerStyle = {
  display: 'flex',
  color: '#fff',
  height: 64,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
};
const titleStyle = {
  fontSize: 16,
  fontWeight: 600,
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
  const {
    pager,
    searchText,
    onFetchTodo,
    onSetSearchText,
  } = useContextInfo();

  React.useEffect(() => {
    getList();

    window.addEventListener('resize', _.debounce(function() {
      getList();
    }, 300), false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getList = async (params = {}) => {
    const {
      // TODO: temporarily set 1(todo status)
      status = 1,
      content = searchText,
      pageNo = pager.pageNo,
      pageSize = pager.pageSize,
    } = params;

    onFetchTodo({
      status,
      content,
      pageNo,
      pageSize,
    });
  };

  const handleSearch = async (e) => {
    const content = e.target.value;
    onSetSearchText(content);
    getList({ content });
  };

  const renderSearch = () => {
    return (
      <div className="global-search-wrapper">
        <Input placeholder="Area search" onChange={_.debounce(handleSearch, 100)} prefix={<SearchOutlined />} allowClear />
      </div>
    );
  };

  return (
    <div className="App">
      <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
        <Layout className="todo-layout">
          <Header className="header" style={headerStyle}>
            <div className="logo" style={titleStyle}>Todo</div>
            {renderSearch()}
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
