import React from 'react';

import { Button, Checkbox, Input, Menu } from 'antd';
import { StarOutlined } from '@ant-design/icons';

import { addTodo } from '../api/todo';
import { FIXED_LIST_ITEM_TASKS } from '../constant/index';
import useContextInfo from '../hooks/use-context-info';

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const Todo = () => {
  const [addedContent, setAddedContent] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const inputRef = React.useRef(null);
  const [points, setPoints] = React.useState({
    x: 0,
    y: 0,
  });

  const {
    todo,
    pager,
    folderParentName,
    searchText,
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

  const renderPosition = () => {
    return (
      <div className="belong-to-wrapper">
        <h3>{folderParentName}</h3>
      </div>
    );
  };

  const handleInput = (e) => {
    setAddedContent(e.target.value);
  };

  const handleClick = async () => {
    if (!addedContent) {
      alert('content can not be empty!');
      return;
    }

    await addTodo({
      content: addedContent,
      list_id: FIXED_LIST_ITEM_TASKS,
    });
    setAddedContent('');
    getList();
    inputRef.current.focus();
  };

  const renderAddListItem = () => {
    return (
      <div className="addition-wrapper">
        <div className="addition-content">
          <Checkbox checked={checked} onChange={onChange} />
          <Input ref={inputRef} value={addedContent} placeholder="Add a task" onChange={handleInput} />
        </div>
        <div className="add-btn">
          <Button onClick={handleClick}>Add</Button>
        </div>
      </div>
    );
  };

  const handleTodoItemRightClick = (e) => {
    e.preventDefault();
    setVisible(true);
    setPoints({
      x: e.pageX,
      y: e.pageY,
    });
  };

  const [checked, setChecked] = React.useState(true);
  const onChange = (e) => {
    setChecked(e.target.checked);
  };
  const renderList = () => {
    return (
      <ul className="todo-wrapper">
        {/* first item is always as additive */}
        <li className="todo-item add-item">
          {renderAddListItem()}
        </li>
        {
          todo.map(item => {
            return (
              <li key={item.id} className="todo-item" onContextMenu={handleTodoItemRightClick}>
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

  const items = [
    getItem('Delete', 'sub1'),
  ];

  const renderContextMenu = () => {
    return visible && (
      <Menu
        // onClick={onClick}
        style={{
          position: 'absolute',
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
    <div className="Todo-wrapper">
      {renderPosition()}
      {renderList()}
      {renderContextMenu()}
    </div>
  );
};

export default Todo;