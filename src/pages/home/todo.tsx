import React from 'react';

import { Button, Checkbox, Input } from 'antd';
import Icon, { DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import _ from 'lodash';

import ContextMenu from '@components/context-menu';
import { fetchTodoItem, addTodo, editTodo, deleteTodo } from '@api/todo';
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
  TAG_BG_COLOR_MAP,
  TAG_TEXT_COLOR_MAP,
} from '@constant/index';
import moveToSvg from '@assets/images/moveout.svg';
import myDaySmallSvg from '@assets/images/my_day_small.svg';
import dueDateSmallSvg from '@assets/images/due_date_small.svg';
import dueDateBlueSvg from '@assets/images/due_date_blue.svg';
import repeatSmallSvg from '@assets/images/repeat_small.svg';
import reminderSmallSvg from '@assets/images/reminder_small.svg';
import attachmentSvg from '@assets/images/attachment.svg';
import noteSvg from '@assets/images/note.svg';
import imporantSvg from '@assets/images/important.svg';
import imporantBorderBlueSvg from '@assets/images/important_border_blue.svg';
import importantBlueSvg from '@assets/images/important_blue.svg';
import checkedGreySvg from '@assets/images/checked_grey.svg';
import dueTodaySvg from '@assets/images/due_today.svg';
import dueTomorrowSvg from '@assets/images/due_tomorrow.svg';
import removeDueDateSvg from '@assets/images/remove_due_date.svg';
import deleteSvg from '@assets/images/delete.svg';
import listSvg from '@assets/images/list.svg';
import getDateDayText from '@/utils/get-date-day-text';

import TodoDrawer from './todo-drawer';

const COLOR_TEXT = {
  [TAG_BG_COLOR_MAP.ORANGE]: 'orange catory',
  [TAG_BG_COLOR_MAP.RED]: 'red category',
  [TAG_BG_COLOR_MAP.VIOLET]: 'violet category',
  [TAG_BG_COLOR_MAP.GREEN]: 'green category',
  [TAG_BG_COLOR_MAP.YELLOW]: 'yellow category',
  [TAG_BG_COLOR_MAP.BLUE]: 'blue category',
};

const Todo = () => {
  const [addedContent, setAddedContent] = React.useState('');
  const [clickedTodo, setClickedTodo] = React.useState<any>({});
  const inputRef = React.useRef<any>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [clickedSteps, setClickedSteps] = React.useState([]);

  const TODO_CONTEXT_MENU_HEIGHT = 327;
  const { visible, points, setPoints, onContextMenuOpen } = useContextMenu({
    onOpen: ({ x, y }: any) => {
      setPoints({
        x,
        y:
          document.body.clientHeight - y < TODO_CONTEXT_MENU_HEIGHT
            ? document.body.clientHeight - TODO_CONTEXT_MENU_HEIGHT
            : y,
      });
    },
  });

  const {
    fixedList,
    otherlist,
    todo,
    searchText,
    listItemInfo,
    onFetchTodo,
    onFetchList,
    onSetTodoId,
  } = useContextInfo() as any;

  React.useEffect(() => {
    onSetTodoId(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchTodo = async () => {
    await onFetchTodo({
      list_id: listItemInfo.id,
      content: searchText,
    });
  };

  const updateTodo = async (todoInfo = {}) => {
    const originClikedTodo = _.omit(clickedTodo, [
      'reminder',
      'due_date',
      'update_time',
      'create_time',
    ]);
    await editTodo({ ...originClikedTodo, ...todoInfo });
    await handleFetchTodo();
    await onFetchList();
  };

  const renderPosition = () => {
    return (
      <div className="position">
        <h3>
          {(LIST_ICON_MAP as any)[listItemInfo.id] || (
            <Icon component={() => <img src={listSvg} />} />
          )}
          <span className="name">{listItemInfo.name}</span>
        </h3>
      </div>
    );
  };

  const handleInput = (e: any) => {
    setAddedContent(e.target.value);
  };

  const handleAdd = async () => {
    if (!addedContent) return;

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
          ? dayjs().format('YYYY-MM-DD')
          : null,
      content: addedContent,
    });
    await handleFetchTodo();
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

  const handleContextMenu = (e: any, item: any) => {
    e.preventDefault();
    onContextMenuOpen(e);
    setClickedTodo(item);
  };

  const handleTodoItemClick = async (item: any) => {
    const { data } = await fetchTodoItem({ id: item.id });
    setClickedTodo(data);
    setClickedSteps(data.subtask);
    setDrawerOpen(true);
  };

  const handleMarkedAsImportant = async (item: any) => {
    updateTodo({
      ..._.omit(item, ['update_time', 'create_time']),
      marked_as_important:
        item.marked_as_important === MARKED_AS_UNIMPORTANT
          ? MARKED_AS_IMPORTANT
          : MARKED_AS_UNIMPORTANT,
    });
  };

  const handleCompleteChange = async (item: any) => {
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
      (item: any) => item.marked_as_completed === marked_as_completed
    );
  };
  const renderListItemContent = (item: any) => {
    const isToday = item.due_date === dayjs().format('YYYY-MM-DD');
    const finishedStepsLength = item.subtask.filter(
      (item: any) => item.marked_as_completed === MARKED_AS_COMPLETED
    ).length;

    return (
      <>
        <Checkbox
          checked={item.marked_as_completed}
          onChange={() => handleCompleteChange(item)}
        />
        <div
          className={`content ${item.marked_as_completed ? 'completed' : 'uncompleted'
            }`}
          onClick={() => handleTodoItemClick(item)}
        >
          <span className="text">{item.content}</span>
          <div className="tags">
            {!!item.added_my_day && (
              <div className="my-day-sign">
                <Icon component={() => <img src={myDaySmallSvg} />} />
                <span>My Day</span>
              </div>
            )}
            {!!item.subtask.length && (
              <div className="task-sign">
                <span>
                  {finishedStepsLength}/{item.subtask.length}
                </span>
              </div>
            )}
            {item.due_date && (
              <div className="due-date-sign">
                <Icon
                  component={() => (
                    <img src={isToday ? dueDateBlueSvg : dueDateSmallSvg} />
                  )}
                />
                <span>{getDateDayText(item.due_date)}</span>
                {!!item.repeated && (
                  <Icon component={() => <img src={repeatSmallSvg} />} />
                )}
              </div>
            )}
            {item.reminder && (
              <div className="reminder-sign">
                <Icon component={() => <img src={reminderSmallSvg} />} />
                <span>{getDateDayText(item.reminder)}</span>
              </div>
            )}
            {item.note && (
              <div className="note-sign">
                <Icon component={() => <img src={noteSvg} />} />
              </div>
            )}
            {item.file && (
              <div className="attachment-sign">
                <Icon component={() => <img src={attachmentSvg} />} />
                <span>File attached</span>
              </div>
            )}
            {item.category &&
              item.category.split(',').map((row: any) => {
                return (
                  <div key={row} className="color-sign">
                    <span
                      className="circle"
                      style={{
                        borderColor: TAG_TEXT_COLOR_MAP[row],
                        backgroundColor: (TAG_BG_COLOR_MAP as any)[row],
                      }}
                    ></span>
                    <span
                      className="category"
                      style={{ color: TAG_TEXT_COLOR_MAP[row] }}
                    >
                      {COLOR_TEXT[row]}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
        <Icon
          className="important-blue-icon"
          component={() => (
            <img
              src={
                item.marked_as_important === MARKED_AS_IMPORTANT
                  ? importantBlueSvg
                  : imporantBorderBlueSvg
              }
            />
          )}
          onClick={() => handleMarkedAsImportant(item)}
        />
      </>
    );
  };
  const renderListItem = (item: any) => {
    return (
      <li
        key={item.id}
        className="todo-item"
        onContextMenu={(e) => handleContextMenu(e, item)}
      >
        {renderListItemContent(item)}
      </li>
    );
  };
  const renderList = (marked_as_completed = MARKED_AS_UNCOMPLETED) => {
    return (
      <ul className="todo-wrapper">
        {filterTodo(marked_as_completed).map((item: any) => {
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

  const decoratedTasklist = fixedList.slice(-1).map((item: any) => {
    item.icon = <Icon component={() => <img src={myDaySmallSvg} />} />;
    return item;
  });
  const decoratedOtherlist = otherlist.map((item: any) => {
    item.icon = <Icon component={() => <img src={listSvg} />} />;
    return item;
  });
  const moveToSubItems = [...decoratedTasklist, ...decoratedOtherlist]
    .filter((item) => item.id !== listItemInfo.id)
    .map((item) => getItem(item.name, item.id, item.icon));
  const items = [
    getItem(
      clickedTodo.added_my_day === ADDED_MY_DAY
        ? 'Remove from My Day'
        : 'Add to My Day',
      'added_my_day',
      <Icon component={() => <img src={myDaySmallSvg} />} />
    ),
    getItem(
      clickedTodo.marked_as_important === MARKED_AS_UNIMPORTANT
        ? 'Mark as important'
        : 'Remove importance',
      'marked_as_important',
      <Icon component={() => <img src={imporantSvg} />} />
    ),
    getItem(
      clickedTodo.marked_as_completed === MARKED_AS_COMPLETED
        ? 'Mark as not completed'
        : 'Mark as completed',
      'marked_as_completed',
      <Icon component={() => <img src={checkedGreySvg} />} />
    ),
    { type: 'divider' },
    getItem(
      'Due today',
      'due_today',
      <Icon component={() => <img src={dueTodaySvg} />} />
    ),
    getItem(
      'Due tomorrow',
      'due_tomorrow',
      <Icon component={() => <img src={dueTomorrowSvg} />} />
    ),
    clickedTodo.due_date
      ? getItem(
        'Remove due date',
        'remove_due_date',
        <Icon component={() => <img src={removeDueDateSvg} />} />
      )
      : null,
    { type: 'divider' },
    getItem(
      'Move task to...',
      'move',
      <Icon component={() => <img src={moveToSvg} />} />,
      moveToSubItems
    ),
    { type: 'divider' },
    getItem(
      'Delete',
      'delete',
      <Icon component={() => <img src={deleteSvg} />} />
    ),
  ];
  const handleMenuClick = async (e: any) => {
    if (e.keyPath.includes('added_my_day')) {
      updateTodo({
        added_my_day:
          clickedTodo.added_my_day === ADDED_MY_DAY
            ? UN_ADDED_MY_DAY
            : ADDED_MY_DAY,
      });
    }

    if (e.keyPath.includes('marked_as_important')) {
      updateTodo({
        marked_as_important:
          clickedTodo.marked_as_important === MARKED_AS_UNIMPORTANT
            ? MARKED_AS_IMPORTANT
            : MARKED_AS_UNIMPORTANT,
      });
    }

    if (e.keyPath.includes('marked_as_completed')) {
      updateTodo({
        marked_as_completed:
          clickedTodo.marked_as_completed === MARKED_AS_COMPLETED
            ? MARKED_AS_UNCOMPLETED
            : MARKED_AS_COMPLETED,
      });
    }

    if (e.keyPath.includes('due_today')) {
      updateTodo({
        due_date: dayjs().format('YYYY-MM-DD'),
      });
    }

    if (e.keyPath.includes('due_tomorrow')) {
      updateTodo({
        due_date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      });
    }

    if (e.keyPath.includes('remove_due_date')) {
      updateTodo({
        due_date: null,
      });
    }

    if (e.keyPath.includes('delete')) {
      await deleteTodo({
        id: clickedTodo.id,
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
        id: clickedTodo.id,
        list_id,
      });
      await onFetchTodo({
        list_id: listItemInfo.id,
        content: searchText,
      });
      await onFetchList();
    }
  };

  const todoDrawerProps = {
    drawerOpen,
    clickedTodo,
    clickedSteps,
    onDrawerOpen: setDrawerOpen,
    onCompleteChange: handleCompleteChange,
    onMarkedAsImportant: handleMarkedAsImportant,
    onUpdateTodo: updateTodo,
    onClickedTodo: setClickedTodo,
    onClickedSteps: setClickedSteps,
    onFetchTodoInDrawer: handleFetchTodo,
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
      <TodoDrawer {...todoDrawerProps} />
    </div>
  );
};

export default Todo;