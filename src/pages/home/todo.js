import React from 'react';

import { Button, Checkbox, Input } from 'antd';
import { StarOutlined } from '@ant-design/icons';

import ContextMenu from '@components/context-menu';
import { addTodo, editTodo, deleteTodo } from '@api/todo';
import useContextInfo from '@hooks/use-context-info';
import useContextMenu from '@hooks/use-context-menu';
import getItem from '@utils/menu-get-item';
import {
  FIXED_LIST_ITEM_MY_DAY,
  FIXED_LIST_ITEM_IMPORTANT,
  FIXED_LIST_ITEM_PLANNED,
  FIXED_LIST_ITEM_ASSIGNED_TO_ME,
  FIXED_LIST_ITEM_TASKS,
  MARKED_AS_UNIMPORTANT,
  MARKED_AS_IMPORTANT,
  UN_ADDED_MY_DAY,
  ADDED_MY_DAY,
} from '@constant/index';

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

  const handleAdd = async () => {
    if (!addedContent) {
      alert('Content can not be empty!');
      return;
    }

    let list_id = listItemInfo.id;
    const spcial_list_ids = [
      FIXED_LIST_ITEM_MY_DAY,
      FIXED_LIST_ITEM_IMPORTANT,
      FIXED_LIST_ITEM_PLANNED,
      FIXED_LIST_ITEM_ASSIGNED_TO_ME,
    ];
    if (spcial_list_ids.includes(listItemInfo.id)) {
      list_id = FIXED_LIST_ITEM_TASKS;
    }

    await addTodo({
      list_id,
      added_my_day:
        listItemInfo.id === FIXED_LIST_ITEM_MY_DAY
          ? ADDED_MY_DAY
          : UN_ADDED_MY_DAY,
      marked_as_important:
        listItemInfo.id === FIXED_LIST_ITEM_IMPORTANT
          ? MARKED_AS_IMPORTANT
          : MARKED_AS_UNIMPORTANT,
      content: addedContent,
    });
    await onFetchTodo({
      list_id: listItemInfo.id,
      content: searchText,
    });
    await onFetchList();
    setAddedContent('');
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
            onPressEnter={handleAdd}
          />
        </div>
        <div className="add-btn">
          <Button onClick={handleAdd}>Add</Button>
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

  const handleMarkedAsImportant = async (item) => {
    await editTodo({
      id: item.id,
      marked_as_important:
        item.marked_as_important === MARKED_AS_UNIMPORTANT
          ? MARKED_AS_IMPORTANT
          : MARKED_AS_UNIMPORTANT,
    });
    await onFetchTodo({
      list_id: listItemInfo.id,
      content: searchText,
    });
    await onFetchList();
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
                    item.marked_as_important === MARKED_AS_IMPORTANT
                      ? '#2564cf'
                      : '',
                }}
                onClick={() => handleMarkedAsImportant(item)}
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
      await onFetchTodo({
        list_id: listItemInfo.id,
        content: searchText,
      });
      await onFetchList();
    }

    if (e.keyPath.includes('move')) {
      const [list_id] = e.keyPath;
      await editTodo({
        id: clikedId,
        list_id,
      });
      await onFetchTodo({
        list_id: listItemInfo.id,
        content: searchText,
      });
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
