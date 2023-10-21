import React from 'react';

import { PlusCircleOutlined, UnorderedListOutlined, HomeOutlined, ScheduleOutlined, UserOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import { Space, Input, Divider, Modal, Form, Button, message } from 'antd';

import { addList } from '../api/list';
import useContextInfo from '../hooks/use-context-info';
import './sider-bar.css';


const lists = new Array(30).fill(null).map((item, index) => {
  return {
    id: index,
    name: 'list' + index,
    createTime: 1697787627,
    updateTime: 1697787630,
    color: 0,
  };
});

const SiderBar = () => {
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();

  const {
    onFetchLists,
    onFetchTodo,
    onSetTodoId,
  } = useContextInfo();
  const [open, setOpen] = React.useState(false);


  const onAddFolder = () => {
    setOpen(true);
  };

  const onSearchAll = () => {
    onFetchTodo({
      id: undefined,
    });
    onSetTodoId(undefined);
  };

  return (
    <Space className="sider-bar-wrapper" direction="vertical" size="small" style={{ display: 'flex' }}>
      <div className="shortcut-menu">
        <Button onClick={onSearchAll} type="link" icon={<FireOutlined className="today-icon" />}>Today</Button>
      </div>
      <div className="shortcut-menu">
        <Button onClick={onSearchAll} type="link" icon={<StarOutlined className="important-icon" />}>Important</Button>
      </div>
      <div className="shortcut-menu">
        <Button onClick={onSearchAll} type="link" icon={<ScheduleOutlined className="planned-icon" />}>Planned</Button>
      </div>
      <div className="shortcut-menu">
        <Button onClick={onSearchAll} type="link" icon={<UserOutlined className="assigned-icon" />}>Assigned to me</Button>
      </div>
      <div className="shortcut-menu">
        <Button onClick={onSearchAll} type="link" icon={<HomeOutlined className="tasks-icon" />}>Tasks</Button>
      </div>
      <Divider
        style={{ margin: 0 }}
      />
      <div className="list-wrapper">
        {
          lists.map(item => {
            return (
              <div key={item.id} className="list-item">
                <UnorderedListOutlined style={{ fontSize: 16, marginRight: 10 }} />
                {item.name}
              </div>
            );
          })
        }
      </div>
      <div className="add-file-list-wrapper" onClick={onAddFolder}>
        <PlusCircleOutlined className="add-icon" />
        List
      </div>
      <Modal
        open={open}
        title={'Add list'}
        okText="Ok"
        cancelText="Cancel"
        confirmLoading={confirmLoading}
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
        onOk={() => {
          setConfirmLoading(true);
          form
            .validateFields()
            .then(async (values) => {
              form.resetFields();
              await addList(values);
              onFetchLists();
              message.success('Add list success.');
              setOpen(false);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            }).finally(() => {
              setConfirmLoading(false);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          onChange={
            (v) => {
              console.log(11, v);
            }
          }
        >
          <Form.Item
            name="name"
            label="Folder Name"
            rules={[
              {
                required: true,
                message: 'Please input the list name.',
              },
            ]}
          >
            <Input placeholder="list name" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default SiderBar;
