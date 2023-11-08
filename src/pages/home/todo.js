import React from 'react';

import { Button, Checkbox, Input } from 'antd';
import {
  StarOutlined,
  DownOutlined,
  HomeOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

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
  MARKED_AS_COMPLETED,
  MARKED_AS_UNCOMPLETED,
  UN_ADDED_MY_DAY,
  ADDED_MY_DAY,
  LIST_ICON_MAP,
} from '@constant/index';

const Todo = () => {
  const [addedContent, setAddedContent] = React.useState('');
  const [clikedId, setClickedId] = React.useState(false);
  const inputRef = React.useRef(null);

  const { visible, points, onContextMenuOpen } = useContextMenu();

  const {
    fixedList,
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
      <div className="position">
        <h3>
          {LIST_ICON_MAP[listItemInfo.id] || (
            <UnorderedListOutlined style={{ fontSize: 16 }} />
          )}
          <span className="name">{listItemInfo.name}</span>
        </h3>
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
      added_my_day: [FIXED_LIST_ITEM_MY_DAY, FIXED_LIST_ITEM_PLANNED].includes(
        listItemInfo.id
      )
        ? ADDED_MY_DAY
        : UN_ADDED_MY_DAY,
      marked_as_important:
        listItemInfo.id === FIXED_LIST_ITEM_IMPORTANT
          ? MARKED_AS_IMPORTANT
          : MARKED_AS_UNIMPORTANT,
      due_date:
        listItemInfo.id === FIXED_LIST_ITEM_PLANNED
          ? dayjs().format('YYYY-MM-DD HH:mm:ss')
          : null,
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

  const renderListAddItem = () => {
    return (
      <div className="addition-wrapper">
        <div className="addition-content">
          <Checkbox checked={false} />
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

  const handleCompleteChange = async (item) => {
    await editTodo({
      id: item.id,
      marked_as_completed:
        item.marked_as_completed === MARKED_AS_COMPLETED
          ? MARKED_AS_UNCOMPLETED
          : MARKED_AS_COMPLETED,
    });
    await onFetchTodo({
      list_id: listItemInfo.id,
      content: searchText,
    });
    await onFetchList();
  };

  const filterTodo = (marked_as_completed = MARKED_AS_UNCOMPLETED) => {
    return todo.filter(
      (item) => item.marked_as_completed === marked_as_completed
    );
  };
  const renderListItemContent = (item) => {
    return (
      <>
        <Checkbox
          checked={item.marked_as_completed}
          onChange={() => handleCompleteChange(item)}
        />
        <div
          className={`content ${
            item.marked_as_completed ? 'completed' : 'uncompleted'
          }`}
        >
          {item.content}
        </div>
        <StarOutlined
          style={{
            color:
              item.marked_as_important === MARKED_AS_IMPORTANT ? '#2564cf' : '',
          }}
          onClick={() => handleMarkedAsImportant(item)}
        />
      </>
    );
  };
  const renderListItem = (item) => {
    return (
      <li
        key={item.id}
        className="todo-item"
        onContextMenu={(e) => handleContextMenu(e, item.id)}
        onClick={() => handleTodoItemClick(item.id)}
      >
        {renderListItemContent(item)}
      </li>
    );
  };
  const renderList = (marked_as_completed = MARKED_AS_UNCOMPLETED) => {
    return (
      <ul className="todo-wrapper">
        {filterTodo(marked_as_completed).map((item) => {
          return renderListItem(item);
        })}
      </ul>
    );
  };

  const renderUnCompletedList = () => {
    return renderList();
  };

  const [show, setShow] = React.useState(true);
  const renderCompletedList = () => {
    const completedListNum = filterTodo(MARKED_AS_COMPLETED).length;

    const NOT_SHOW_COMPLETED_LIST = [
      FIXED_LIST_ITEM_MY_DAY,
      FIXED_LIST_ITEM_IMPORTANT,
      FIXED_LIST_ITEM_PLANNED,
      FIXED_LIST_ITEM_ASSIGNED_TO_ME,
    ];
    if (!completedListNum || NOT_SHOW_COMPLETED_LIST.includes(listItemInfo.id))
      return null;

    return (
      <div className="todo-completed-wrapper">
        <a
          className="dropdown-btn"
          onClick={(e) => {
            e.preventDefault();
            setShow(!show);
          }}
        >
          <DownOutlined className={`${show ? 'up' : 'down'}`} />
          <h3 className="completed-label">Completed</h3>
          <h3 className="completed-list-num">{completedListNum}</h3>
        </a>
        {show ? renderList(MARKED_AS_COMPLETED) : null}
      </div>
    );
  };

  const decoratedTasklist = fixedList.slice(-1).map((item) => {
    item.icon = <HomeOutlined style={{ fontSize: 16 }} />;
    return item;
  });
  const decoratedOtherlist = otherlist.map((item) => {
    item.icon = <UnorderedListOutlined style={{ fontSize: 16 }} />;
    return item;
  });
  const moveToSubItems = [...decoratedTasklist, ...decoratedOtherlist]
    .filter((item) => item.id !== listItemInfo.id)
    .map((item) => getItem(item.name, item.id, item.icon));
  const items = [
    getItem('Delete', 'delete'),
    getItem('Move task to', 'move', null, moveToSubItems),
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
    <div className="todo-container">
      {renderPosition()}
      {renderListAddItem()}
      {renderUnCompletedList()}
      {renderCompletedList()}
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
