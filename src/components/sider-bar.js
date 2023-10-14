import React from 'react';

import { PlusCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { Tree, Space, Input, Divider, Modal, Form, Cascader, Button, message } from 'antd';

import request from '../utils/request';
import generateNestedFolders from '../utils/generate-nested-folders';
import useContextInfo from '../hooks/use-context-info';
import './sider-bar.css';

const { Search } = Input;
const { DirectoryTree } = Tree;

const SiderBar = () => {
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();

  const {
    folders,
    onFetchFolders,
    onFetchTodo,
    onSetFolderParentId,
    onSetTodoId,
    onSetFolderParentName,
  } = useContextInfo();
  const [open, setOpen] = React.useState(false);
  const treeData = generateNestedFolders(folders);

  const options = generateNestedFolders(folders, true);

  const onSearch = () => {
    console.log('search');
  };

  const onSelect = async (keys, infos) => {
    const {
      isLeaf,
      id,
      title,
    } = infos.node;
    onSetFolderParentName(title);
    if (isLeaf) {
      onSetFolderParentId(undefined);
      onSetTodoId(id);
      return onFetchTodo({
        id: id,
        parent_id: undefined,
      });
    }
    const arr = keys[0].split('-');
    const parent_id = +arr[arr.length - 1];
    onFetchTodo({
      parent_id,
      id: undefined,
    });
    onSetFolderParentId(parent_id);
    onSetTodoId(undefined);
  };

  const onAddFolder = () => {
    setOpen(true);
  };

  const filter = (inputValue, path) => {
    return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  };

  const onSearchAll = () => {
    onFetchTodo({
      parent_id: undefined,
      id: undefined,
    });
    onSetFolderParentId(undefined);
    onSetTodoId(undefined);
  };

  return (
    <Space className="sider-bar-wrapper" direction="vertical" size="small" style={{ display: 'flex' }}>
      <Search
        placeholder="Site search"
        allowClear
        onSearch={onSearch}
      />
      <Divider
        style={{ margin: '5px 0' }}
      />
      <div className="search-site-all">
        <Button onClick={onSearchAll} type="link" icon={<InboxOutlined className="all-icon" />}>All</Button>
      </div>
      <Divider
        style={{ margin: '5px 0' }}
      />
      <DirectoryTree
        rootClassName="folder-wrapper"
        multiple
        defaultExpandAll
        onSelect={onSelect}
        treeData={treeData}
      />
      <div className="add-file-list-wrapper" onClick={onAddFolder}>
        <PlusCircleOutlined className="add-icon" />
        Group
      </div>
      <Modal
        open={open}
        title={'Add group'}
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
              if (values.parent_id) {
                values.parent_id = values.parent_id[values.parent_id.length - 1];
              }
              await request(
                `http://localhost:8000/folders/add`,
                JSON.stringify(values),
              );
              onFetchFolders();
              message.success('Add folder success.');
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
          initialValues={{
            parent_id: [1],
          }}
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
                message: 'Please input the folder name.',
              },
            ]}
          >
            <Input placeholder="folder name" />
          </Form.Item>
          <Form.Item
            name="parent_id"
            label="Parent Folder Name"
          >
            <Cascader
              options={options}
              placeholder="Please select"
              showSearch={{
                filter,
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default SiderBar;
