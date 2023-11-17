import React from 'react';

import { Checkbox, Input, Drawer, Dropdown, Divider, DatePicker } from 'antd';
import Icon, { StarOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import {
  MARKED_AS_IMPORTANT,
  UN_ADDED_MY_DAY,
  ADDED_MY_DAY,
  MARKED_AS_UNCOMPLETED,
  MARKED_AS_COMPLETED,
  MARKED_AS_UNIMPORTANT,
  LOCALE_DAY_OF_WEEK,
  LOCALE_MONTH,
} from '@constant/index';
import {
  fetchTodoItem,
  addSubtask,
  editSubtask,
  deleteSubtask,
} from '@api/todo';

import myDaySmallSvg from '@assets/images/my_day_small.svg';
import myDayBlueSvg from '@assets/images/my_day_bule.svg';
import reminderSvg from '@assets/images/reminder.svg';
import reminderBlueSvg from '@assets/images/reminder_blue.svg';

const { TextArea } = Input;

const TodoDrawer = (props) => {
  const {
    drawerOpen,
    clickedTodo,
    clickedSteps,
    onDrawerOpen,
    onCompleteChange,
    onMarkedAsImportant,
    onUpdateTodo,
    onClickedTodo,
    onClickedSteps,
  } = props;

  const [remindmeOpen, setRemindmeOpen] = React.useState(false);
  const [addedStep, setAddedStep] = React.useState('');
  const [clickedSubtask, setClickedSubtask] = React.useState({});

  const closeDrawer = () => {
    onDrawerOpen(false);
  };

  const completeTodoInDrawer = () => {
    onCompleteChange(clickedTodo);
    const newClickedTodo = { ...clickedTodo };
    newClickedTodo.marked_as_completed =
      clickedTodo.marked_as_completed === MARKED_AS_COMPLETED
        ? MARKED_AS_UNCOMPLETED
        : MARKED_AS_COMPLETED;
    onClickedTodo(newClickedTodo);
  };

  const makeImportantTodoInDrawer = () => {
    onMarkedAsImportant(clickedTodo);
    const newClickedTodo = { ...clickedTodo };
    newClickedTodo.marked_as_important =
      clickedTodo.marked_as_important === MARKED_AS_UNIMPORTANT
        ? MARKED_AS_IMPORTANT
        : MARKED_AS_UNIMPORTANT;
    onClickedTodo(newClickedTodo);
  };

  const handleAddStepInput = (e) => {
    setAddedStep(e.target.value);
  };

  const handleAddStep = async () => {
    await addSubtask({
      todo_id: clickedTodo.id,
      content: addedStep,
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    onClickedTodo(data);
    onClickedSteps(data.subtask);
    setAddedStep('');
  };

  const handleEditStepInput = (index, newContent) => {
    const newClickedSteps = [...clickedSteps];
    newClickedSteps[index].content = newContent;
    onClickedSteps(newClickedSteps);
    setClickedSubtask(clickedSteps[index]);
  };

  const handleEditStep = async () => {
    if (!clickedSubtask.id) return;

    await editSubtask({
      id: clickedSubtask.id,
      content: clickedSubtask.content,
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    onClickedTodo(data);
    onClickedSteps(data.subtask);
    setClickedSubtask({});
  };

  const handleDeleteStep = async (id) => {
    await deleteSubtask({
      id,
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    onClickedTodo(data);
    onClickedSteps(data.subtask);
  };

  const handleCheckedStep = async (clickedStep) => {
    await editSubtask({
      id: clickedStep.id,
      marked_as_completed: clickedStep.marked_as_completed
        ? MARKED_AS_UNCOMPLETED
        : MARKED_AS_COMPLETED,
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    onClickedTodo(data);
    onClickedSteps(data.subtask);
    setClickedSubtask({});
  };

  const handleAddedMyDay = async (added_my_day = ADDED_MY_DAY) => {
    await onUpdateTodo({
      id: clickedTodo.id,
      added_my_day,
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    onClickedTodo(data);
  };

  const handleOpenChange = (open) => {
    setRemindmeOpen(open);
  };

  const handleRminderQuickshort = async (reminder) => {
    await onUpdateTodo({
      id: clickedTodo.id,
      reminder,
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    onClickedTodo(data);
    handleOpenChange(false);
  };

  const onPickDateOk = (value) => {
    handleRminderQuickshort(`${value.format('YYYY-MM-DD HH:mm')}:00`);
  };

  const later4Hour = dayjs().hour() + 4;
  const reminderHour = dayjs(clickedTodo.reminder).hour();
  const reminderMinute = dayjs(clickedTodo.reminder).minute();
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
        `${LOCALE_DAY_OF_WEEK[reminderDay]}, ${LOCALE_MONTH[reminderMonth]} ${reminderDate}`;

  return (
    <Drawer
      className="todo-drawer"
      title=""
      placement="right"
      closable={false}
      onClose={closeDrawer}
      open={drawerOpen}
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
                    onChange={(e) => handleEditStepInput(index, e.target.value)}
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
        <Icon
          component={() => (
            <img
              src={clickedTodo.added_my_day ? myDayBlueSvg : myDaySmallSvg}
            />
          )}
        />
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
                Tomorrow {LOCALE_DAY_OF_WEEK[dayjs().day() + 1]}, 9 AM
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
              <div className="custom-pick">
                <DatePicker
                  placeholder="Pick a date & time"
                  showTime={{
                    format: 'HH:mm',
                  }}
                  format="YYYY-MM-DD HH:mm"
                  onOk={onPickDateOk}
                />
              </div>
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
                className={`time-text ${clickedTodo.reminder ? 'setted' : ''}`}
              >
                {clickedTodo.reminder
                  ? `Remind me at ${
                      reminderHour > 12 ? reminderHour - 12 : reminderHour
                    }${reminderMinute > 0 ? ':' + reminderMinute : ''} ${
                      reminderHour > 12 ? 'pm' : 'am'
                    }`
                  : 'Remind me'}
              </span>
              {clickedTodo.reminder && (
                <span className="day-text">{dayText}</span>
              )}
            </div>
            <CloseOutlined
              onClick={(e) => {
                e.stopPropagation();
                handleRminderQuickshort(null);
              }}
            />
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
  );
};

export default TodoDrawer;
