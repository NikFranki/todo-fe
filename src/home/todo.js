import React from 'react';

import { Button, Checkbox, Input, Menu } from 'antd';
import { StarOutlined } from '@ant-design/icons';

import { addTodo, editTodo, deleteodo } from '../api/todo';
import { FIXED_LIST_ITEM_TASKS, FIXED_LIST_ITEM_IMPORTANT } from '../constant/index';
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
  const [clikedId, setClickedId] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const inputRef = React.useRef(null);
  const [points, setPoints] = React.useState({
    x: 0,
    y: 0,
  });

  const {
    todo,
    folderParentName,
    searchText,
    onFetchTodo,
    onSetTodoId,
  } = useContextInfo();

  React.useEffect(() => {
    onSetTodoId(undefined);

    document.addEventListener('click', (e) => {
      const target = document.querySelector('.todo-context-menu');
      if (visible && !target.contains(e.target)) {
        setVisible(false);
      }
    }, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getList = async (params = {}) => {
    const {
      // TODO: temporarily set 1(todo status)
      status = 1,
      content = searchText,
    } = params;

    onFetchTodo({
      status,
      content,
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

  const handleEnter = (e) => {
    console.log(111, e.target.value)
    handleClick();
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
          <Input ref={inputRef} value={addedContent} placeholder="Add a task" onChange={handleInput} onPressEnter={handleEnter} />
        </div>
        <div className="add-btn">
          <Button onClick={handleClick}>Add</Button>
        </div>
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

  const handleTodoItemClick = async (id) => {
    await editTodo({
      id,
      status: FIXED_LIST_ITEM_IMPORTANT,
    });
    getList();
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
              <li key={item.id} className="todo-item" onContextMenu={(e) => handleContextMenu(e, item.id)} onClick={() => handleTodoItemClick(item.id)}>
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
    getItem('Delete', 'delete'),
  ];

  const onMenuClick =  async (e) => {
    e.domEvent.stopPropagation();
    if (e.key === 'delete') {
      setVisible(false);
      await deleteodo({
        id: clikedId,
      });
      await getList();
    }
  };

  const renderContextMenu = () => {
    return visible && (
      <Menu
        className="todo-context-menu"
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
    <div className="Todo-wrapper">
      {renderPosition()}
      {renderList()}
      {renderContextMenu()}
    </div>
  );
};

export default Todo;