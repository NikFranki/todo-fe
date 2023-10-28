import React from 'react';

import { Button, Checkbox, Input } from 'antd';
import { StarOutlined } from '@ant-design/icons';

import ContextMenu from '@components/context-menu';
import { addTodo, editTodo, deleteTodo } from '@api/todo';
import {
  FIXED_LIST_ITEM_TASKS,
  FIXED_LIST_ITEM_IMPORTANT,
} from '@constant/index';
import useContextInfo from '@hooks/use-context-info';
import useContextMenu from '@hooks/use-context-menu';
import getItem from '@utils/menu-get-item';

const Todo = () => {
  const [addedContent, setAddedContent] = React.useState('');
  const [clikedId, setClickedId] = React.useState(false);
  const inputRef = React.useRef(null);

  const { visible, points, onContextMenuOpen } = useContextMenu();

  const {
    otherlist,
    todo,
    searchText,
    listItemInfo,
    onFetchTodo,
    onFetchList,
    onSetTodoId,
  } = useContextInfo();

  React.useEffect(() => {
    onSetTodoId(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTodo = async (params = {}) => {
    const { content = searchText } = params;

    onFetchTodo({
      content,
    });
  };

  const renderPosition = () => {
    return (
      <div className="belong-to-wrapper">
        <h3>{listItemInfo.name}</h3>
      </div>
    );
  };

  const handleInput = (e) => {
    setAddedContent(e.target.value);
  };

  const handleEnter = () => {
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
    getTodo();
    inputRef.current.focus();
  };

  const renderAddListItem = () => {
    return (
      <div className="addition-wrapper">
        <div className="addition-content">
          <Checkbox checked={checked} onChange={onChange} />
          <Input
            ref={inputRef}
            value={addedContent}
            placeholder="Add a task"
            onChange={handleInput}
            onPressEnter={handleEnter}
          />
        </div>
        <div className="add-btn">
          <Button onClick={handleClick}>Add</Button>
        </div>
      </div>
    );
  };

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    onContextMenuOpen(e);
    setClickedId(id);
  };

  const handleTodoItemClick = async () => {};

  const onStar = async (id, list_id) => {
    await editTodo({
      id,
      list_id,
    });
    getTodo();
  };

  const [checked, setChecked] = React.useState(true);

  const onChange = (e) => {
    setChecked(e.target.checked);
  };

  const renderList = () => {
    return (
      <ul className="todo-wrapper">
        <li className="todo-item add-item">{renderAddListItem()}</li>
        {todo.map((item) => {
          return (
            <li
              key={item.id}
              className="todo-item"
              onContextMenu={(e) => handleContextMenu(e, item.id)}
              onClick={() => handleTodoItemClick(item.id)}
            >
              <Checkbox checked={checked} onChange={onChange} />
              <div className="content">{item.content}</div>
              <StarOutlined
                style={{
                  color:
                    item.list_id === FIXED_LIST_ITEM_IMPORTANT ? '#2564cf' : '',
                }}
                onClick={() =>
                  onStar(
                    item.id,
                    item.list_id === FIXED_LIST_ITEM_IMPORTANT
                      ? FIXED_LIST_ITEM_TASKS
                      : FIXED_LIST_ITEM_IMPORTANT
                  )
                }
              />
            </li>
          );
        })}
      </ul>
    );
  };

  const items = [
    getItem('Delete', 'delete'),
    getItem(
      'Move task to',
      'move',
      null,
      otherlist.map((item) => getItem(item.name, item.id))
    ),
  ];
  const handleMenuClick = async (e) => {
    if (e.keyPath.includes('delete')) {
      await deleteTodo({
        id: clikedId,
      });
      await getTodo();
      await onFetchList();
    }

    if (e.keyPath.includes('move')) {
      const [list_id] = e.keyPath;
      await editTodo({
        id: clikedId,
        list_id,
      });
      await getTodo();
      await onFetchList();
    }
  };

  return (
    <div className="Todo-wrapper">
      {renderPosition()}
      {renderList()}
      <ContextMenu
        items={items}
        visible={visible}
        points={points}
        onMenuClick={handleMenuClick}
      />
    </div>
  );
};

export default Todo;
