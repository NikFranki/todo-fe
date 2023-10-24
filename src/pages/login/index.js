import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';

import TodoContext from '@utils/todo-context';
import { login } from '@api/user';

import './index.css';

const Register = () => {
  const navigate = useNavigate();

  const { onUserInfoChange, setAuthenticated } = React.useContext(TodoContext);

  const onFinish = async (values) => {
    const res = await login(values);
    if (res.code !== 200) {
      message.error(res.message);
      return { ok: false };
    }

    localStorage.setItem('token', res.token);

    setAuthenticated(true);
    navigate('/', { replace: true });
    // 查询用户，更新用户信息，使得 context 传递 userInfo 给其他组件
    onUserInfoChange();
    return { ok: true };
  };

  return (
    <div className="login-wrapper">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>{' '}
          Or <Link to="/register">register now!</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
