import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Dropdown, Space, Avatar, message, Upload } from 'antd';

import { logout } from '@api/user';
import { importTodo, exportTodo } from '@api/todo';
import downloadFile from '@utils/download-file';

import './menu.scss';
import useGlobalContextInfo from '@/hooks/use-global-context-info';
import { RcFile } from 'antd/es/upload';
import { ItemType } from 'antd/es/menu/hooks/useItems';

const Menu = () => {
  const navigate = useNavigate();

  const { userInfo } = useGlobalContextInfo();
  const { username, avatar } = userInfo;
  const userLogined = userInfo.username;

  const onExport = async () => {
    const res = await exportTodo();

    downloadFile(res);
  };

  const handleLogout = async () => {
    try {
      await logout({});
      navigate('/login', { replace: true });
    } catch (error: unknown) {
      message.error((error as Error)?.message);
    }
  };

  const renderImport = () => {
    const props = {
      name: 'file',
      showUploadList: false,
      maxCount: 1,
      accept: '.xlsx',
      withCredentials: true,
      beforeUpload: async (file: RcFile) => {
        if (file) {
          const formData = new FormData();
          formData.append('todos', file);
          await importTodo(formData);
          message.success(`${file.name} file uploaded successfully`);
          // getList();
        }
        return false;
      },
    };

    return (
      <div
        style={{ display: 'inline-block', height: 22 }}
        className="import-todo"
      >
        <Upload {...props}>
          <a style={{ color: 'inherit' }}>Import Todo</a>
        </Upload>
      </div>
    );
  };

  const items = !userLogined
    ? [
      {
        label: <Link to="/login">Login</Link>,
        key: '0',
      },
    ]
    : [
      {
        label: <a onClick={handleLogout}>Logout</a>,
        key: '1',
      },
      {
        type: 'divider',
      },
      {
        label: renderImport(),
        key: '2',
      },
      {
        label: <a onClick={onExport}>Export Todo</a>,
        key: '3',
      },
      {
        label: <Link to="/profile">Profile</Link>,
        key: '4',
      },
    ] as ItemType[];

  return (
    <div className="header-menu-wrapper">
      <Dropdown
        className="avater-dropdown"
        menu={{ items }}
        trigger={['click']}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <Avatar src={avatar} />
          </Space>
        </a>
      </Dropdown>
      <span>{username}</span>
    </div>
  );
};

export default Menu;
