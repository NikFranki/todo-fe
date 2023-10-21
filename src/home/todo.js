import React from 'react';

import { Button, message, Checkbox, Input } from 'antd';
import { StarOutlined } from '@ant-design/icons';

import { addTodo, editTodo } from '../api/todo';
import useContextInfo from '../hooks/use-context-info';
import Edit from './edit-form-modal';

const Todo = () => {
  const [mode, setMode] = React.useState('');
  const [todoDetail, setTodoDetail] = React.useState({});

  const {
    pager,
    folderParentName,
    searchText,
    onFetchLists,
    onFetchTodo,
    onSetTodoId,
  } = useContextInfo();

  React.useEffect(() => {
    onSetTodoId(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getList = async (params = {}) => {
    const {
      // TODO: temporarily set 1(todo status)
      status = 1,
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

    if (mode === 'add') {
      await addTodo(values);
    } else {
      await editTodo(values);
    }
    message.success(`${mode[0].toUpperCase()}${mode.slice(1).toLowerCase()} successfully`);
    getList();
    onFetchLists();
  };

  const renderPosition = () => {
    return (
      <div className="belong-to-wrapper">
        <h3>{folderParentName}</h3>
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
  const renderList = () => {
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

  return (
    <div className="Todo-wrapper">
      {renderPosition()}
      {renderList()}
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