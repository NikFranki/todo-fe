import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Upload, message } from 'antd';

import { register } from '@api/user';

import './index.scss';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [avatar, setAvater] = React.useState(null);

  const onFinish = async (values) => {
    values.avatar = avatar;
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('password', values.password);
    formData.append('repassword', values.repassword);
    if (values.avatar) {
      formData.append('avatar', values.avatar);
    }
    const res = await register(formData);
    if (res.code !== 200) {
      message.error(res.message);
      return { ok: false };
    }
    message.success('Register successfully.');
    navigate('/login');
    return { ok: true };
  };

  return (
    <div className="register-wrapper">
      <div className="register-wrapper">
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            prefix: '86',
          }}
          style={{
            maxWidth: 600,
          }}
          scrollToFirstError
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="repassword"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'The two passwords that you entered do not match!'
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Upload"
            rules={[
              {
                required: true,
                message: 'input Image',
              },
            ]}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              maxCount={1}
              accept=".jpg, .png"
              beforeUpload={(file) => {
                if (file) {
                  setAvater(file);
                }
                return false;
              }}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>{' '}
            Or <Link to="/login">already an account, login!</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
