import React from 'react';
import {
  useNavigate,
} from "react-router-dom";

import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Upload, message } from 'antd';

import TodoContext from '../utils/todo-context';
import request from '../utils/request';

import './index.css';

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

const Profile = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [avatar, setAvater] = React.useState(null);

  const { userInfo, onUserInfoChange } = React.useContext(TodoContext);
  const { username, avatar: userInfoAvatar } = userInfo;

  const onFinish = async (values) => {
    values.avatar = avatar;
    const formData = new FormData();
    formData.append('username', values.username);
    if (values.avatar) {
      formData.append('avatar', values.avatar);
    }
    const res = await request(
      'http://localhost:8000/user/update',
      formData,
      'post',
      {}
    );
    if (res.code !== 200) {
      message.error(res.message);
      return { ok: false };
    }
    message.success('Update successfully.');
    navigate('/');
    onUserInfoChange();
    return { ok: true };
  };

  if (!username) {
    return null;
  }

  return (
    <div className="profile-wrapper">
      <Form
        className="profile-form"
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          username,
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
            defaultFileList={[
              {
                uid: '1',
                name: 'avatar.png',
                status: 'done',
                url: userInfoAvatar,
              }
            ]}
            listType="picture-card"
            maxCount={1}
            accept=".jpg, .png"
            beforeUpload={(file) => {
              console.log(1234);
              if (file) {
                console.log('file', file);
                setAvater(file);
              }
              return false;
            }}
            onRemove={() => setAvater(null)}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Profile;