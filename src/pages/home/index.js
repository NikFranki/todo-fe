import React from 'react';

import { Layout, Space, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import _ from 'lodash';

import Menu from '@components/menu';
import Todo from './todo';
import SiderBar from '@components/sider-bar';
import useContextInfo from '@hooks/use-context-info';
import { FIXED_LIST_ITEM_MY_DAY } from '@constant/index';

import './home.css';

const { Header, Footer, Sider, Content } = Layout;

function Home() {
  const { onFetchTodo, onFetchList, onSetSearchText } = useContextInfo();

  React.useEffect(() => {
    sequenceRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sequenceRequest = async () => {
    await onFetchTodo({ list_id: FIXED_LIST_ITEM_MY_DAY });
    await onFetchList();
  };

  const handleSearch = (e) => {
    const content = e.target.value;
    onSetSearchText(content);
    onFetchTodo({ content });
  };

  const renderSearch = () => {
    return (
      <div className="global-search-wrapper">
        <Input
          placeholder="Area search"
          onChange={_.debounce(handleSearch, 100)}
          prefix={<SearchOutlined />}
          allowClear
        />
      </div>
    );
  };

  return (
    <div className="App">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Layout className="todo-layout">
          <Header className="header">
            <div className="logo">Todo</div>
            {renderSearch()}
            <Menu />
          </Header>
          <Layout className="content-layout">
            <Sider className="menu-side-bar">
              <SiderBar />
            </Sider>
            <Content className="content-wrapper">
              <Todo />
            </Content>
          </Layout>
          <Footer className="footer">
            @Copyright reserved by franki & christ {dayjs().format('YYYY')}
          </Footer>
        </Layout>
      </Space>
    </div>
  );
}

export default Home;
