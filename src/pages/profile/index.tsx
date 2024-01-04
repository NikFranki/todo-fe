import React from 'react';
import { useNavigate } from 'react-router-dom';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Upload, message } from 'antd';

import { updateUser } from '@api/user';

import './index.scss';
import type { RcFile } from 'antd/es/upload';
import useGlobalContextInfo from '@/hooks/use-global-context-info';

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
  const [avatar, setAvater] = React.useState<RcFile | null>(null);

  const { userInfo, onUserInfoChange } = useGlobalContextInfo();
  const { username, avatar: userInfoAvatar } = userInfo;

  const onFinish = async (values: any) => {
    values.avatar = avatar;
    const formData = new FormData();
    formData.append('username', values.username);
    if (values.avatar) {
      formData.append('avatar', values.avatar);
    }
    const res = await updateUser(formData) as any;
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
              },
            ]}
            listType="picture-card"
            maxCount={1}
            accept=".jpg, .png"
            beforeUpload={(file: RcFile) => {
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
