import React from 'react';

import { Button, Checkbox, Input } from 'antd';
import Icon, {
  StarOutlined,
  DownOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  ScheduleOutlined,
  FireOutlined,
  DeleteOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import _ from 'lodash';

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
import moveToSvg from '@assets/images/moveout.svg';

const Todo = () => {
  const [addedContent, setAddedContent] = React.useState('');
  const [clikedTodo, setClickedTodo] = React.useState({});
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

  const updateTodo = async (todoInfo = {}) => {
    await editTodo(todoInfo);
    await onFetchTodo({
      list_id: listItemInfo.id,
      content: searchText,
    });
    await onFetchList();
  };

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

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    onContextMenuOpen(e);
    setClickedTodo(item);
  };

  const handleTodoItemClick = async () => {};

  const handleMarkedAsImportant = async (item) => {
    updateTodo({
      ..._.omit(item, ['update_time', 'create_time']),
      marked_as_important:
        item.marked_as_important === MARKED_AS_UNIMPORTANT
          ? MARKED_AS_IMPORTANT
          : MARKED_AS_UNIMPORTANT,
    });
  };

  const handleCompleteChange = async (item) => {
    updateTodo({
      ..._.omit(item, ['update_time', 'create_time']),
      marked_as_completed:
        item.marked_as_completed === MARKED_AS_COMPLETED
          ? MARKED_AS_UNCOMPLETED
          : MARKED_AS_COMPLETED,
    });
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
        onContextMenu={(e) => handleContextMenu(e, item)}
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
    getItem(
      clikedTodo.added_my_day === ADDED_MY_DAY
        ? 'Remove from My Day'
        : 'Add to My Day',
      'added_my_day',
      <FireOutlined />
    ),
    getItem(
      clikedTodo.marked_as_important === MARKED_AS_UNIMPORTANT
        ? 'Mark as important'
        : 'Remove importance',
      'marked_as_important',
      <StarOutlined />
    ),
    getItem(
      clikedTodo.marked_as_completed === MARKED_AS_COMPLETED
        ? 'Mark as not completed'
        : 'Mark as completed',
      'marked_as_completed',
      <CheckSquareOutlined />
    ),
    { type: 'divider' },
    getItem('Due today', 'due_today', <ScheduleOutlined />),
    getItem('Due tomorrow', 'due_tomorrow', <ScheduleOutlined />),
    { type: 'divider' },
    getItem(
      'Move task to...',
      'move',
      <Icon component={() => <img src={moveToSvg} />} />,
      moveToSubItems
    ),
    { type: 'divider' },
    getItem('Delete', 'delete', <DeleteOutlined />),
  ];
  const handleMenuClick = async (e) => {
    var pickedClikedTodo = _.omit(clikedTodo, ['update_time', 'create_time']);
    if (e.keyPath.includes('added_my_day')) {
      updateTodo({
        ...pickedClikedTodo,
        added_my_day:
          clikedTodo.added_my_day === ADDED_MY_DAY
            ? UN_ADDED_MY_DAY
            : ADDED_MY_DAY,
      });
    }

    if (e.keyPath.includes('marked_as_important')) {
      updateTodo({
        ...pickedClikedTodo,
        marked_as_important:
          clikedTodo.marked_as_important === MARKED_AS_UNIMPORTANT
            ? MARKED_AS_IMPORTANT
            : MARKED_AS_UNIMPORTANT,
      });
    }

    if (e.keyPath.includes('marked_as_completed')) {
      updateTodo({
        ...pickedClikedTodo,
        marked_as_completed:
          clikedTodo.marked_as_completed === MARKED_AS_COMPLETED
            ? MARKED_AS_UNCOMPLETED
            : MARKED_AS_COMPLETED,
      });
    }

    if (e.keyPath.includes('delete')) {
      await deleteTodo({
        id: clikedTodo.id,
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
        id: clikedTodo.id,
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
