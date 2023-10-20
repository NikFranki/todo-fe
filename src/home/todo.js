import React from 'react';

import { Button, Radio, Divider, List, Skeleton, Tooltip, message, Checkbox, Input } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';

import { fetchTodoListById, addTodo, editTodo, deleteodo } from '../api/todo';
import useContextInfo from '../hooks/use-context-info';
import Edit from './edit-form-modal';
import { DEFAULT_PAGESIZE, DEFAULT_FOLDER_SEQUENCE, DEFAULT_FOLDER_NAME } from '../constant';
import getTextWidth from '../utils/get-text-width';
import getPerTextWidth from '../utils/get-per-text-width';
import getMaxNumberOfText from '../utils/get-max-number-of-text';

const FILTER_ALL = 1;
const FILTER_TODO = 2;
const FILTER_DONE = 3;

const Todo = () => {
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
    searchText,
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

  const onEdit = async (item) => {
    setMode('edit');
    const res = await getTodoById(item.id);
    setTodoDetail(res);
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

  const renderAddItem = () => {
    return (
      <div className="add-item-wrapper">
        <Button type="primary" onClick={onAdd}>Add todo</Button>
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
                  <div className="ant-todo-list-item-content">
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

  const [addedContent, setAddedContent] = React.useState('');
  const [lists, setLists] = React.useState([]);

  const handleInput = (e) => {
    setAddedContent(e.target.value);
  };

  const handleClick = () => {
    const newLists = [...lists, { id: lists.length, content: addedContent }];
    setLists(newLists);
    setAddedContent('');
  };

  const renderAddListItem = () => {
    return (
      <div className="addition-wrapper">
        <div className="addition-content">
          <Checkbox checked={checked} onChange={onChange} />
          <Input value={addedContent} placeholder="Add a task" onChange={handleInput} />
        </div>
        <div className="add-btn">
          <Button onClick={handleClick}>Add</Button>
        </div>
      </div>
    );
  };

  const [checked, setChecked] = React.useState(true);
  const onChange = (e) => {
    console.log('checked = ', e.target.checked);
    setChecked(e.target.checked);
  };
  const renderList1 = () => {
    return (
      <ul className="todo-list-wrapper">
        {/* first item is always as additive */}
        <li className="todo-list-item add-item">
          {renderAddListItem()}
        </li>
        {
          lists.map(item => {
            return (
              <li key={item.id} className="todo-list-item">
                <Checkbox checked={checked} onChange={onChange} />
                <div className="content">
                  {item.content}
                </div>
                <StarOutlined />
              </li>
            );
          })
        }
      </ul>
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
      {/* {renderAddItem()} */}
      {/* {renderList()} */}
      {renderList1()}
      {/* {renderFilter()} */}
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