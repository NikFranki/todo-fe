import React from 'react';

import { Checkbox, Input, Drawer, Dropdown, Divider, DatePicker } from 'antd';
import Icon, { StarOutlined, CloseOutlined } from '@ant-design/icons';
import { Select, Tag } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';

import {
  MARKED_AS_IMPORTANT,
  UN_ADDED_MY_DAY,
  ADDED_MY_DAY,
  MARKED_AS_UNCOMPLETED,
  MARKED_AS_COMPLETED,
  MARKED_AS_UNIMPORTANT,
  LOCALE_DAY_OF_WEEK,
  LOCALE_MONTH,
  NO_REPEATED,
  REPEATED,
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
import dueDateSmallSvg from '@assets/images/due_date_small.svg';
import dueDateSmallBlueSvg from '@assets/images/due_date_samll_blue.svg';
import repeatSvg from '@assets/images/repeat.svg';
import repeatBlueSvg from '@assets/images/repeat_blue.svg';
import pickACategorySvg from '@assets/images/pick_a_category.svg';

const { TextArea } = Input;

const DROPDOWN_TYPE = {
  REMINDER: 'reminder',
  DUE_DATE: 'due_date',
  REPEATED: 'repeated',
};

const COLOR_TEXT_TYPE = {
  ORANGE: 'orange',
  RED: 'red',
  VIOLET: 'violet',
  GREEN: 'green',
  YELLOW: 'yellow',
  BLUE: 'blue',
};

const options = [
  { label: 'orange catory', value: COLOR_TEXT_TYPE.ORANGE },
  { label: 'red category', value: COLOR_TEXT_TYPE.RED },
  { label: 'violet category', value: COLOR_TEXT_TYPE.VIOLET },
  { label: 'green category', value: COLOR_TEXT_TYPE.GREEN },
  { label: 'yellow category', value: COLOR_TEXT_TYPE.YELLOW },
  { label: 'blue category', value: COLOR_TEXT_TYPE.BLUE },
];

const tagRender = (props) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color={value}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};

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

  const [dropdownOpen, setDropdownOpen] = React.useState({});
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

  const handleOpenChange = (key, value) => {
    const map = {
      [DROPDOWN_TYPE.REMINDER]: 'reminder',
      [DROPDOWN_TYPE.DUE_DATE]: 'due_date',
      [DROPDOWN_TYPE.REPEATED]: 'repeated',
    };
    const newDPO = {
      [map[key]]: value,
    };
    setDropdownOpen(newDPO);
  };

  const handleDropdownQuickshortSelect = async (key, value) => {
    const map = {
      [DROPDOWN_TYPE.REMINDER]: 'reminder',
      [DROPDOWN_TYPE.DUE_DATE]: 'due_date',
      [DROPDOWN_TYPE.REPEATED]: 'repeated',
    };
    await onUpdateTodo({
      id: clickedTodo.id,
      [map[key]]: value,
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    onClickedTodo(data);
    handleOpenChange(DROPDOWN_TYPE.REMINDER, false);
  };

  const onPickDateOk = (key, value) => {
    handleDropdownQuickshortSelect(
      key,
      `${value.format('YYYY-MM-DD HH:mm')}:00`
    );
  };

  const handlePickACategoryChange = async (value) => {
    await onUpdateTodo({
      id: clickedTodo.id,
      category: value.join(','),
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    onClickedTodo(data);
  };

  const handleNoteInputChange = async (e) => {
    const value = e.target.value;
    await onUpdateTodo({
      id: clickedTodo.id,
      note: value,
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    onClickedTodo(data);
  };

  const later4Hour = dayjs().hour() + 4;
  const reminderHour = dayjs(clickedTodo.reminder).hour();
  const reminderMinute = dayjs(clickedTodo.reminder).minute();
  const reminderDay = dayjs(clickedTodo.reminder).day();
  const dueDateDay = dayjs(clickedTodo.due_date).day();
  const reminderDate = dayjs(clickedTodo.reminder).date();
  const reminderFormat = dayjs(clickedTodo.reminder).format(
    'YYYY-MM-DD HH:mm:ss'
  );
  const dueDateDate = dayjs(clickedTodo.due_date).date();
  const dueDateFormat = dayjs(clickedTodo.due_date).format('YYYY-MM-DD');
  const reminderMonth = dayjs(clickedTodo.reminder).month();
  const dueDateMonth = dayjs(clickedTodo.due_date).month();
  const todayFormat = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const todayDateFormat = dayjs().format('YYYY-MM-DD');
  const tomorrowFormat = dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
  const tomorrowDateFormat = dayjs().add(1, 'day').format('YYYY-MM-DD');
  const nextWeekMondayDistance = 7 - dayjs().day() + 1;

  const dayText =
    reminderFormat === todayFormat
      ? 'Today'
      : reminderFormat === tomorrowFormat
      ? 'Tomorrow'
      : // eslint-disable-next-line max-len
        `${LOCALE_DAY_OF_WEEK[reminderDay]}, ${LOCALE_MONTH[reminderMonth]} ${reminderDate}`;
  const dueDateDayText =
    dueDateFormat === todayDateFormat
      ? 'Today'
      : dueDateFormat === tomorrowDateFormat
      ? 'Tomorrow'
      : // eslint-disable-next-line max-len
        `Due ${LOCALE_DAY_OF_WEEK[dueDateDay]}, ${LOCALE_MONTH[dueDateMonth]} ${dueDateDate}`;

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
        {!!clickedTodo.added_my_day && (
          <CloseOutlined
            onClick={(e) => {
              e.stopPropagation();
              handleAddedMyDay(UN_ADDED_MY_DAY);
            }}
          />
        )}
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
                  handleDropdownQuickshortSelect(
                    DROPDOWN_TYPE.REMINDER,
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
                  handleDropdownQuickshortSelect(
                    DROPDOWN_TYPE.REMINDER,
                    `${dayjs().add(1, 'day').format('YYYY-MM-DD')} 09:00:00`
                  )
                }
              >
                Tomorrow {LOCALE_DAY_OF_WEEK[dayjs().day() + 1]}, 9 AM
              </div>
              <div
                className="reminder-quickshort"
                onClick={() =>
                  handleDropdownQuickshortSelect(
                    DROPDOWN_TYPE.REMINDER,
                    `${dayjs()
                      .add(nextWeekMondayDistance, 'day')
                      .format('YYYY-MM-DD')} 09:00:00`
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
                  onOk={(value) => onPickDateOk(DROPDOWN_TYPE.REMINDER, value)}
                />
              </div>
            </div>
          )}
          open={dropdownOpen[DROPDOWN_TYPE.REMINDER]}
          onOpenChange={(open) =>
            handleOpenChange(DROPDOWN_TYPE.REMINDER, open)
          }
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
                    }${
                      reminderMinute > 0
                        ? ':' +
                          `${
                            reminderMinute > 10
                              ? reminderMinute
                              : `0${reminderMinute}`
                          }`
                        : ''
                    } ${reminderHour > 12 ? 'pm' : 'am'}`
                  : 'Remind me'}
              </span>
              {clickedTodo.reminder && (
                <span className="day-text">{dayText}</span>
              )}
            </div>
            {clickedTodo.reminder && (
              <CloseOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  handleDropdownQuickshortSelect(DROPDOWN_TYPE.REMINDER, null);
                }}
              />
            )}
          </div>
        </Dropdown>
        <Dropdown
          placement="bottom"
          trigger="click"
          dropdownRender={() => (
            <div className="due-date-dropdown">
              <div className="title">Due</div>
              <Divider style={{ margin: '5px 0' }} />
              <div
                className="due-date-quickshort"
                onClick={() =>
                  handleDropdownQuickshortSelect(
                    DROPDOWN_TYPE.DUE_DATE,
                    `${dayjs().format('YYYY-MM-DD')}`
                  )
                }
              >
                Today
              </div>
              <div
                className="due-date-quickshort"
                onClick={() =>
                  handleDropdownQuickshortSelect(
                    DROPDOWN_TYPE.DUE_DATE,
                    `${dayjs().add(1, 'day').format('YYYY-MM-DD')}`
                  )
                }
              >
                Tomorrow
              </div>
              <div
                className="due-date-quickshort"
                onClick={() =>
                  handleDropdownQuickshortSelect(
                    DROPDOWN_TYPE.DUE_DATE,
                    `${dayjs()
                      .add(nextWeekMondayDistance, 'day')
                      .format('YYYY-MM-DD')}`
                  )
                }
              >
                Next Week Mon
              </div>
              <Divider style={{ margin: '5px 0' }} />
              <div className="custom-pick">
                <DatePicker
                  placeholder="Pick a date"
                  onChange={(value) =>
                    handleDropdownQuickshortSelect(
                      DROPDOWN_TYPE.DUE_DATE,
                      value.format('YYYY-MM-DD')
                    )
                  }
                />
              </div>
            </div>
          )}
          open={dropdownOpen[DROPDOWN_TYPE.DUE_DATE]}
          onOpenChange={(open) =>
            handleOpenChange(DROPDOWN_TYPE.DUE_DATE, open)
          }
        >
          <div className="add-due-date">
            <Icon
              component={() => (
                <img
                  src={
                    clickedTodo.due_date ? dueDateSmallBlueSvg : dueDateSmallSvg
                  }
                />
              )}
            />
            <div className="notice-text">
              <span
                className={`time-text ${clickedTodo.due_date ? 'setted' : ''}`}
              >
                {clickedTodo.due_date ? (
                  <span className="day-text">{dueDateDayText}</span>
                ) : (
                  'Add due date'
                )}
              </span>
            </div>
            {clickedTodo.due_date && (
              <CloseOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  handleDropdownQuickshortSelect(DROPDOWN_TYPE.DUE_DATE, null);
                }}
              />
            )}
          </div>
        </Dropdown>
        <div className="repeat">
          <Icon
            component={() => (
              <img src={clickedTodo.repeated ? repeatBlueSvg : repeatSvg} />
            )}
          />
          <div
            className="notice-text"
            onClick={() => {
              handleDropdownQuickshortSelect(DROPDOWN_TYPE.REPEATED, REPEATED);
            }}
          >
            <span
              className={`time-text ${clickedTodo.repeated ? 'setted' : ''}`}
            >
              Repeat
            </span>
          </div>
          {!!clickedTodo.repeated && (
            <CloseOutlined
              onClick={(e) => {
                e.stopPropagation();
                handleDropdownQuickshortSelect(
                  DROPDOWN_TYPE.REPEATED,
                  NO_REPEATED
                );
              }}
            />
          )}
        </div>
      </div>
      <div className="pick-a-category">
        <Icon component={() => <img src={pickACategorySvg} />} />
        <Select
          mode="multiple"
          placeholder="Pick a category"
          tagRender={tagRender}
          value={clickedTodo.category?.split(',')}
          style={{ width: '100%' }}
          options={options}
          onChange={handlePickACategoryChange}
        />
      </div>
      <div className="add-file">
        <Icon component={() => <img src={myDaySmallSvg} />} />
        <span>Add file</span>
      </div>
      <div className="add-note">
        <TextArea
          showCount
          rows={4}
          maxLength={1000}
          placeholder="Add note"
          onChange={_.debounce(handleNoteInputChange, 300)}
        />
      </div>
    </Drawer>
  );
};

export default TodoDrawer;