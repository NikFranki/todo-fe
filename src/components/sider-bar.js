import React from 'react';

import { PlusCircleOutlined, UnorderedListOutlined, HomeOutlined, ScheduleOutlined, UserOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import { Space, Input, Divider, Modal, Form, Button, message, Menu } from 'antd';

import { addList, deleteList } from '../api/list';
import useContextInfo from '../hooks/use-context-info';
import getItem from '../utils/menu-get-item';
import useContextMenu from '../hooks/use-context-menu';
import './sider-bar.css';

const SiderBar = () => {
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [sbfixedList, setSbfixedlist] = React.useState([]);
  const [sbotherList, setSbotherlist] = React.useState([]);
  const [clikedId, setClickedId] = React.useState(false);
  const [form] = Form.useForm();

  const { visible, setVisible, points, setPoints } = useContextMenu();

  const {
    list,
    fixedList,
    otherlist,
    todo,
    searchText,
    onFetchList,
    onFetchTodo,
    onSetTodoId,
  } = useContextInfo();
  const [open, setOpen] = React.useState(false);

  const accumulateListNumber = () => {
    return todo.reduce((acc, prev) => {
      if (acc[prev.list_id]) {
        acc[prev.list_id]++;
      } else {
        acc[prev.list_id] = 1;
      }
      return acc;
    }, {});
  };

  const listNumberMap = accumulateListNumber();
  const factor = Object.entries(listNumberMap).map(([key, value]) => `${key}:${value}`).join('_');
  React.useEffect(() => {
    if (!list.length) return;
    const icons = [
      <FireOutlined className="today-icon" />,
      <StarOutlined className="important-icon" />,
      <ScheduleOutlined className="planned-icon" />,
      <UserOutlined className="assigned-icon" />,
      <HomeOutlined className="tasks-icon" />
    ];
    const newFixedList = fixedList.map((item, index) => {
      return {
        ...item,
        icon: icons[index],
        number: listNumberMap[item.id] || 0,
      };
    });
    setSbfixedlist(newFixedList);
    const newOtherList = otherlist.map((item, index) => {
      return {
        ...item,
        icon: <UnorderedListOutlined style={{ fontSize: 16, marginRight: 10 }} />,
        number: listNumberMap[item.id] || 0,
      };
    });
    setSbotherlist(newOtherList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length, factor]);

  const onAddFolder = () => {
    setOpen(true);
  };

  const onSearchAll = () => {
    onFetchTodo({
      id: undefined,
    });
    onSetTodoId(undefined);
  };

  const renderFixedList = () => {
    return sbfixedList.map(item => {
      return (
        <div key={item.id} className="shortcut-menu">
          <Button onClick={onSearchAll} type="link" icon={item.icon}>
            {item.name}
            <span>{item.number}</span>
          </Button>
        </div>
      );
    });
  };

  const renderOtherList = () => {
    return (
      <div className="list-wrapper other-list">
        {
          sbotherList.map(item => {
            return (
              <div key={item.id} className="list-item" onContextMenu={(e) => handleContextMenu(e, item.id)}>
                <UnorderedListOutlined style={{ fontSize: 16, marginRight: 10 }} />
                {item.name}
                <span>{item.number}</span>
              </div>
            );
          })
        }
      </div>
    );
  };

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    setClickedId(id);
    setVisible(true);
    setPoints({
      x: e.pageX,
      y: e.pageY,
    });
  };

  const items = [
    getItem('Delete', 'delete'),
  ];
  const onMenuClick = async (e) => {
    e.domEvent.stopPropagation();
    if (e.keyPath.includes('delete')) {
      await deleteList({
        id: clikedId,
      });
      await onFetchTodo({
        content: searchText,
      });
      await onFetchList();
    }
  };
  const renderContextMenu = () => {
    return visible && (
      <Menu
        onClick={onMenuClick}
        style={{
          position: 'fixed',
          width: 256,
          left: points.x,
          top: points.y,
        }}
        mode="vertical"
        items={items}
      />
    );
  };

  return (
    <Space className="sider-bar-wrapper" direction="vertical" size="small" style={{ display: 'flex' }}>
      {renderFixedList()}
      <Divider style={{ margin: 0 }} />
      {renderOtherList()}
      <div className="add-file-list-wrapper" onClick={onAddFolder}>
        <PlusCircleOutlined className="add-icon" />
        List
      </div>
      {renderContextMenu()}
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
