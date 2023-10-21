import React from 'react';

import { PlusCircleOutlined, UnorderedListOutlined, HomeOutlined, ScheduleOutlined, UserOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import { Space, Input, Divider, Modal, Form, Button, message } from 'antd';

import { addList } from '../api/list';
import useContextInfo from '../hooks/use-context-info';
import './sider-bar.css';

const SiderBar = () => {
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [fixedList, setFixedlist] = React.useState([]);
  const [otherList, setOtherlist] = React.useState([]);
  const [form] = Form.useForm();

  const {
    list,
    onFetchList,
    onFetchTodo,
    onSetTodoId,
  } = useContextInfo();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!list.length) return;
    const icons = [
      <FireOutlined className="today-icon" />,
      <StarOutlined className="important-icon" />,
      <ScheduleOutlined className="planned-icon" />,
      <UserOutlined className="assigned-icon" />,
      <HomeOutlined className="tasks-icon" />
    ];
    const newFixedList = list.slice(0, 5).map((item, index) => {
      return {
        ...item,
        icon: icons[index],
      };
    });
    setFixedlist(newFixedList);
    const newOtherList = list.slice(5).map((item, index) => {
      return {
        ...item,
        icon: <UnorderedListOutlined style={{ fontSize: 16, marginRight: 10 }} />,
      };
    });
    setOtherlist(newOtherList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length]);

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
      {
        fixedList.map(item => {
          return (
            <div key={item.id} className="shortcut-menu">
              <Button onClick={onSearchAll} type="link" icon={item.icon}>{item.name}</Button>
            </div>
          );
        })
      }
      <Divider
        style={{ margin: 0 }}
      />
      <div className="list-wrapper">
        {
          otherList.map(item => {
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
              onFetchList();
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
