import React from 'react';

import { Input, Button, Radio, Divider, List, Skeleton, Upload, Tooltip, message } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import _ from 'lodash';

import { fetchTodoListById, addTodo, editTodo, deleteodo, importTodo, exportTodo } from '../api/todo';
import useContextInfo from '../hooks/use-context-info';
import Edit from './edit-form-modal';
import downloadFile from '../utils/download-file';
import { DEFAULT_PAGESIZE, DEFAULT_FOLDER_SEQUENCE, DEFAULT_FOLDER_NAME } from '../constant';
import getTextWidth from '../utils/get-text-width';
import getPerTextWidth from '../utils/get-per-text-width';
import getMaxNumberOfText from '../utils/get-max-number-of-text';

const FILTER_ALL = 1;
const FILTER_TODO = 2;
const FILTER_DONE = 3;

const { Search } = Input;

const Todo = () => {
  const [searchText, setSearchText] = React.useState('');
  const [status, setStatus] = React.useState(FILTER_ALL);
  const [filteredStatus, setFilteredStatus] = React.useState(FILTER_ALL);
  const [mode, setMode] = React.useState('');
  const [todoDetail, setTodoDetail] = React.useState({});

  const bodyWidth = document.body.getBoundingClientRect().width;
  const ListItemMaxWidth = bodyWidth - 950;
  const textRate = getPerTextWidth();

  const {
    list,
    pager,
    folderParentName,
    onFetchGroups,
    onFetchTodo,
    onSetFolderParentId,
    onSetTodoId,
    onSetFolderParentName,
  } = useContextInfo();

  React.useEffect(() => {
    onSetFolderParentName(DEFAULT_FOLDER_NAME);
    onSetFolderParentId(DEFAULT_FOLDER_SEQUENCE);
    onSetTodoId(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTodoById = async (id) => {
    const res = await fetchTodoListById({ id });
    return res.data;
  };

  const getList = async (params = {}) => {
    const {
      status = filteredStatus,
      content = searchText,
      pageNo = pager.pageNo,
      pageSize = pager.pageSize,
    } = params;

    onFetchTodo({
      status,
      content,
      pageNo,
      pageSize,
    });
  };

  React.useEffect(() => {
    getList();

    window.addEventListener('resize', _.debounce(function() {
      getList();
    }, 300), false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (mode, values) => {
    setMode('');
    setTodoDetail({});

    if (!values.content) {
      alert('content can not be empty!');
      return;
    }
    if (!values.date) {
      alert('date can not be empty!');
      return;
    };

    values.position_id = Array.isArray(values.position_id) && values.position_id.length > 0 ? values.position_id : [1];
    values.folder_id = values.position_id[values.position_id.length - 1];

    if (mode === 'add') {
      await addTodo(values);
    } else {
      await editTodo(values);
    }
    message.success(`${mode[0].toUpperCase()}${mode.slice(1).toLowerCase()} successfully`);
    getList();
    onFetchGroups();
  };

  const onAdd = () => {
    setMode('add');
  };

  const onExport = async () => {
    const res = await exportTodo();

    downloadFile(res);
  };

  const onEdit = async (item) => {
    setMode('edit');
    const res = await getTodoById(item.id);
    setTodoDetail(res);
  };

  const handleSearch = async (content) => {
    setSearchText(content);
    getList({ content });
  };

  const handleDelete = async (id) => {
    await deleteodo({ id });
    getList();
  };

  const handleFilter = (e) => {
    const status = e.target.value;
    setStatus(status);
    setFilteredStatus(status);
    getList({
      status,
    });
  };

  const renderPosition = () => {
    return (
      <div className="belong-to-wrapper">
        <h3>{folderParentName}</h3>
      </div>
    );
  };

  const renderSearch = () => {
    return (
      <div className="search-wrapper">
        <Search placeholder="Area search" onSearch={handleSearch} enterButton allowClear />
      </div>
    );
  };

  const renderAddItem = () => {
    return (
      <div className="add-item-wrapper">
        <Button type="primary" onClick={onAdd}>Add todo</Button>
      </div>
    );
  };

  const renderExportAndImport = () => {
    const props = {
      name: 'file',
      showUploadList: false,
      maxCount: 1,
      accept: '.xlsx',
      withCredentials: true,
      beforeUpload: async (file) => {
        if (file) {
          const formData = new FormData();
          formData.append('todos', file);
          await importTodo(formData);
          message.success(`${file.name} file uploaded successfully`);
          getList();
        }
        return false;
      },
    };

    return (
      <div className="export-and-import-todos-wrapper">
        <Button className="export-btn" icon={<DownloadOutlined />} onClick={onExport}>Export todos</Button>
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Import todos</Button>
        </Upload>
      </div>
    );
  };

  const renderList = () => {
    return (
      <div
        id="scrollableDiv"
        style={{
          height: 'calc(100vh - 495px)',
          overflow: 'auto',
          margin: '30px 80px',
          padding: '0 16px',
          border: '1px solid rgba(140, 140, 140, 0.35)',
        }}
      >
        <InfiniteScroll
          dataLength={list.length}
          next={() => {
            getList({
              pageSize: (pager.pageNo + 1) * pager.pageSize
            });
          }}
          hasMore={list.length < pager.total && list.length > DEFAULT_PAGESIZE}
          loader={
            <Skeleton
              avatar
              paragraph={{
                rows: 1,
              }}
              active
            />
          }
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={list}
            renderItem={(item) => {
              const maxNumberOfText = getMaxNumberOfText(ListItemMaxWidth, textRate);
              return (
                <List.Item
                  key={item.email}
                  actions={[
                    <Button type="default" key="list-loadmore-edit" onClick={() => onEdit(item)}>edit</Button>,
                    <Button type="primary" danger key="list-loadmore-more" onClick={() => handleDelete(item.id)}>delete</Button>
                  ]}
                >
                  <div className="ant-list-item-content">
                    <Radio
                      name="check"
                      checked={item.status === FILTER_DONE}
                      onClick={() => {
                        onSubmit('edit', {
                          ...item,
                          status: item.status === FILTER_DONE ? FILTER_TODO : FILTER_DONE,
                        });
                      }}
                    />
                    <span className="content">
                      {
                        item.content.length > maxNumberOfText
                          ? <Tooltip className={`text-width-${getTextWidth(item.content)}`} placement="topLeft" title={item.content}>
                            {item.content.slice(0, maxNumberOfText).concat('...')}
                          </Tooltip>
                          : item.content
                      }
                    </span>
                    <span className="author">post by {item.username || 'franki'}</span>
                    <span className="date">{item.date}</span>
                  </div>
                </List.Item>
              );
            }}
          />
        </InfiniteScroll>
      </div>
    );
  };

  const renderFilter = () => {
    return (
      <Radio.Group className="filter-menu-wrapper" value={status} onChange={handleFilter}>
        <Radio.Button value={FILTER_ALL}>ALL</Radio.Button>
        <Radio.Button value={FILTER_DONE}>DONE</Radio.Button>
        <Radio.Button value={FILTER_TODO}>TODO</Radio.Button>
      </Radio.Group>
    );
  };

  return (
    <div className="Todo-wrapper">
      {renderPosition()}
      {renderSearch()}
      {renderAddItem()}
      {renderExportAndImport()}
      {renderList()}
      {renderFilter()}
      <Edit
        todoDetail={todoDetail}
        mode={mode}
        onSubmit={onSubmit}
        onCancel={() => {
          setMode('');
        }}
      />
    </div>
  );
};

export default Todo;