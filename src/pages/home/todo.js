import React from 'react';

import { Button, Checkbox, Input, Drawer, Dropdown, Divider } from 'antd';
import Icon, {
  StarOutlined,
  DownOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  ScheduleOutlined,
  FireOutlined,
  DeleteOutlined,
  CheckSquareOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import _ from 'lodash';

import ContextMenu from '@components/context-menu';
import {
  fetchTodoItem,
  addTodo,
  editTodo,
  deleteTodo,
  addSubtask,
  editSubtask,
  deleteSubtask,
} from '@api/todo';
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
import myDaySmallSvg from '@assets/images/my_day_small.svg';
import todayBlueSvg from '@assets/images/today_blue.svg';
import dueDateSmallSvg from '@assets/images/due_date_small.svg';
import reminderSvg from '@assets/images/reminder.svg';
import reminderBlueSvg from '@assets/images/reminder_blue.svg';

const { TextArea } = Input;

const Todo = () => {
  const [addedContent, setAddedContent] = React.useState('');
  const [clickedTodo, setClickedTodo] = React.useState({});
  const inputRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [clickedSteps, setClickedSteps] = React.useState([]);

  const TODO_CONTEXT_MENU_HEIGHT = 327;
  const { visible, points, setPoints, onContextMenuOpen } = useContextMenu({
    onOpen: ({ x, y }) => {
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
  } = useContextInfo();

  React.useEffect(() => {
    onSetTodoId(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTodo = async (todoInfo = {}) => {
    const originClikedTodo = _.omit(clickedTodo, [
      'reminder',
      'due_date',
      'update_time',
      'create_time',
    ]);
    await editTodo({ ...originClikedTodo, ...todoInfo });
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

  const handleTodoItemClick = async (item) => {
    const { data } = await fetchTodoItem({ id: item.id });
    setClickedTodo(data);
    setClickedSteps(data.subtask);
    showDrawer();
  };

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
    const isToday = item.due_date === dayjs().format('YYYY-MM-DD');
    const isTomorrow =
      item.due_date === dayjs().add(1, 'day').format('YYYY-MM-DD');
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
            {isToday && (
              <div className="today-sign">
                <Icon component={() => <img src={todayBlueSvg} />} />
                <span>Today</span>
              </div>
            )}
            {isTomorrow && (
              <div className="tomorrow-sign">
                <Icon component={() => <img src={dueDateSmallSvg} />} />
                <span>Tomorrow</span>
              </div>
            )}
          </div>
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
      clickedTodo.added_my_day === ADDED_MY_DAY
        ? 'Remove from My Day'
        : 'Add to My Day',
      'added_my_day',
      <FireOutlined />
    ),
    getItem(
      clickedTodo.marked_as_important === MARKED_AS_UNIMPORTANT
        ? 'Mark as important'
        : 'Remove importance',
      'marked_as_important',
      <StarOutlined />
    ),
    getItem(
      clickedTodo.marked_as_completed === MARKED_AS_COMPLETED
        ? 'Mark as not completed'
        : 'Mark as completed',
      'marked_as_completed',
      <CheckSquareOutlined />
    ),
    { type: 'divider' },
    getItem('Due today', 'due_today', <ScheduleOutlined />),
    getItem('Due tomorrow', 'due_tomorrow', <ScheduleOutlined />),
    clickedTodo.due_date
      ? getItem('Remove due date', 'remove_due_date', <ScheduleOutlined />)
      : null,
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

  const showDrawer = () => {
    setOpen(true);
  };
  const closeDrawer = () => {
    setOpen(false);
  };
  const completeTodoInDrawer = () => {
    handleCompleteChange(clickedTodo);
    const newClickedTodo = { ...clickedTodo };
    newClickedTodo.marked_as_completed =
      clickedTodo.marked_as_completed === MARKED_AS_COMPLETED
        ? MARKED_AS_UNCOMPLETED
        : MARKED_AS_COMPLETED;
    setClickedTodo(newClickedTodo);
  };
  const makeImportantTodoInDrawer = () => {
    handleMarkedAsImportant(clickedTodo);
    const newClickedTodo = { ...clickedTodo };
    newClickedTodo.marked_as_important =
      clickedTodo.marked_as_important === MARKED_AS_UNIMPORTANT
        ? MARKED_AS_IMPORTANT
        : MARKED_AS_UNIMPORTANT;
    setClickedTodo(newClickedTodo);
  };
  const [addedStep, setAddedStep] = React.useState('');
  const handleAddStepInput = (e) => {
    setAddedStep(e.target.value);
  };
  const handleAddStep = async () => {
    await addSubtask({
      todo_id: clickedTodo.id,
      content: addedStep,
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    setClickedTodo(data);
    setClickedSteps(data.subtask);
    setAddedStep('');
  };
  const [clickedSubtask, setClickedSubtask] = React.useState({});
  const handleEditStepInput = (index, newContent) => {
    const newClickedSteps = [...clickedSteps];
    newClickedSteps[index].content = newContent;
    setClickedSteps(newClickedSteps);
    setClickedSubtask(clickedSteps[index]);
  };
  const handleEditStep = async () => {
    if (!clickedSubtask.id) return;

    await editSubtask({
      id: clickedSubtask.id,
      content: clickedSubtask.content,
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    setClickedTodo(data);
    setClickedSteps(data.subtask);
    setClickedSubtask({});
  };
  const handleDeleteStep = async (id) => {
    await deleteSubtask({
      id,
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    setClickedTodo(data);
    setClickedSteps(data.subtask);
  };
  const handleCheckedStep = async (clickedStep) => {
    await editSubtask({
      id: clickedStep.id,
      marked_as_completed: clickedStep.marked_as_completed
        ? MARKED_AS_UNCOMPLETED
        : MARKED_AS_COMPLETED,
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    setClickedTodo(data);
    setClickedSteps(data.subtask);
    setClickedSubtask({});
  };
  const handleAddedMyDay = async (added_my_day = ADDED_MY_DAY) => {
    await updateTodo({
      id: clickedTodo.id,
      added_my_day,
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    setClickedTodo(data);
  };
  // const handleRemindMe = async () => {
  //   await updateTodo({
  //     id: clickedTodo.id,
  //     reminder: dayjs().add(1, 'minute').format('YYYY-MM-DD HH:mm:ss'),
  //   });
  //   const { data } = await fetchTodoItem({ id: clickedTodo.id });
  //   setClickedTodo(data);
  // };
  const [remindmeOpen, setRemindmeOpen] = React.useState(false);
  const handleOpenChange = (open) => {
    setRemindmeOpen(open);
  };
  const localeDayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // 0: Sunday 1: Monday 2: Tuesday 3 Wednesday 4: Thursday 5: Friday 6: Saturday
  const localeMonth = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]; // 0: January 1: Feburay 2: March 3 April 4: May 5: June 6: July 7: August 8: September 9: October 10: November 11: December
  const handleRminderQuickshort = async (reminder) => {
    await updateTodo({
      id: clickedTodo.id,
      reminder,
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    setClickedTodo(data);
    handleOpenChange(false);
  };
  const later4Hour = dayjs().hour() + 4;
  const reminderHour = dayjs(clickedTodo.reminder).hour();
  const reminderDay = dayjs(clickedTodo.reminder).day();
  const reminderDate = dayjs(clickedTodo.reminder).date();
  const reminderMonth = dayjs(clickedTodo.reminder).month();
  const todayDate = dayjs().date();

  const dayText =
    reminderDate === todayDate
      ? 'Today'
      : reminderDate === todayDate + 1
      ? 'Tomorrow'
      : // eslint-disable-next-line max-len
        `${localeDayOfWeek[reminderDay]}, ${localeMonth[reminderMonth]} ${reminderDate}`;

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
      <Drawer
        className="todo-drawer"
        title=""
        placement="right"
        closable={false}
        onClose={closeDrawer}
        open={open}
        key="right"
      >
        <div className="subject-operation">
          <div className="content-area">
            <Checkbox
              checked={clickedTodo.marked_as_completed}
              onChange={completeTodoInDrawer}
            />
            <div
              className={`content ${
                clickedTodo.marked_as_completed ? 'completed' : 'uncompleted'
              }`}
            >
              <span className="text">{clickedTodo.content}</span>
            </div>
            <StarOutlined
              style={{
                color:
                  clickedTodo.marked_as_important === MARKED_AS_IMPORTANT
                    ? '#2564cf'
                    : '',
              }}
              onClick={makeImportantTodoInDrawer}
            />
          </div>
          <div className="add-step">
            <div className="steps">
              {clickedSteps.map((item, index) => {
                return (
                  <div key={item.id} className="edited-step">
                    <Checkbox
                      checked={item.marked_as_completed}
                      onChange={() => handleCheckedStep(item)}
                    />
                    <Input
                      autosize="true"
                      value={item.content}
                      onChange={(e) =>
                        handleEditStepInput(index, e.target.value)
                      }
                      onBlur={handleEditStep}
                      onPressEnter={handleEditStep}
                      suffix={
                        <CloseOutlined
                          onClick={() => handleDeleteStep(item.id)}
                        />
                      }
                    />
                  </div>
                );
              })}
            </div>
            <div className="new-step">
              <Checkbox checked={false} />
              <Input
                autosize="true"
                value={addedStep}
                placeholder="Add step"
                onChange={handleAddStepInput}
                onBlur={() => setAddedStep('')}
                onPressEnter={handleAddStep}
              />
            </div>
          </div>
        </div>
        <div
          className="added-to-my-day"
          onClick={() => handleAddedMyDay(ADDED_MY_DAY)}
        >
          <Icon component={() => <img src={myDaySmallSvg} />} />
          <span
            className={`text ${
              clickedTodo.added_my_day === ADDED_MY_DAY ? 'added' : ''
            }`}
          >
            {clickedTodo.added_my_day === ADDED_MY_DAY
              ? 'Added to My Day'
              : 'Add to My Day'}
          </span>
          <CloseOutlined
            onClick={(e) => {
              e.stopPropagation();
              handleAddedMyDay(UN_ADDED_MY_DAY);
            }}
          />
        </div>
        <div className="date-reminder">
          <Dropdown
            placement="bottom"
            trigger="click"
            dropdownRender={() => (
              <div className="reminder-dropdown">
                <div className="title">Reminder</div>
                <Divider style={{ margin: '5px 0' }} />
                <div
                  className="reminder-quickshort"
                  onClick={() =>
                    handleRminderQuickshort(
                      `${dayjs().format('YYYY-MM-DD')} ${later4Hour}:00:00`
                    )
                  }
                >
                  Later Today {later4Hour > 12 ? later4Hour - 12 : later4Hour}
                  :00 PM
                </div>
                <div
                  className="reminder-quickshort"
                  onClick={() =>
                    handleRminderQuickshort(
                      `${dayjs().add(1, 'day').format('YYYY-MM-DD')} 09:00:00`
                    )
                  }
                >
                  Tomorrow {localeDayOfWeek[dayjs().day() + 1]}, 9 AM
                </div>
                <div
                  className="reminder-quickshort"
                  onClick={() =>
                    handleRminderQuickshort(
                      `${dayjs().add(1, 'week').format('YYYY-MM-DD')} 09:00:00`
                    )
                  }
                >
                  Next Week Mon, 9 AM
                </div>
                <Divider style={{ margin: '5px 0' }} />
                <div className="custom-pick">Pick a date & time</div>
              </div>
            )}
            open={remindmeOpen}
            onOpenChange={handleOpenChange}
          >
            <div className="remind-me">
              <Icon
                component={() => (
                  <img
                    src={clickedTodo.reminder ? reminderBlueSvg : reminderSvg}
                  />
                )}
              />
              <div className="notice-text">
                <span
                  className={`time-text ${
                    clickedTodo.reminder ? 'setted' : ''
                  }`}
                >
                  {clickedTodo.reminder
                    ? `Remind me at ${
                        reminderHour > 12 ? reminderHour - 12 : reminderHour
                      } ${reminderHour > 12 ? 'pm' : 'am'}`
                    : 'Remind me'}
                </span>
                {clickedTodo.reminder && (
                  <span className="day-text">{dayText}</span>
                )}
              </div>
            </div>
          </Dropdown>
          <div className="add-due-date">
            <Icon component={() => <img src={myDaySmallSvg} />} />
            <span>Add due date</span>
          </div>
          <div className="repeat">
            <Icon component={() => <img src={myDaySmallSvg} />} />
            <span>Repeat</span>
          </div>
        </div>
        <div className="pick-a-category">
          <Icon component={() => <img src={myDaySmallSvg} />} />
          <span>Pick a category</span>
        </div>
        <div className="add-file">
          <Icon component={() => <img src={myDaySmallSvg} />} />
          <span>Add file</span>
        </div>
        <div className="add-note">
          <TextArea rows={4} placeholder="Add note" />
        </div>
      </Drawer>
    </div>
  );
};

export default Todo;
