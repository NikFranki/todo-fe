import React from 'react';

import { Checkbox, Input, Drawer, Dropdown, Divider, DatePicker } from 'antd';
import Icon from '@ant-design/icons';
import { Select, Tag, Upload } from 'antd';
import dayjs from 'dayjs';

import {
  MARKED_AS_IMPORTANT,
  UN_ADDED_MY_DAY,
  ADDED_MY_DAY,
  MARKED_AS_UNCOMPLETED,
  MARKED_AS_COMPLETED,
  MARKED_AS_UNIMPORTANT,
  LOCALE_DAY_OF_WEEK,
  NO_REPEATED,
  REPEATED,
  TAG_BG_COLOR_MAP,
  TAG_TEXT_COLOR_MAP,
} from '@constant/index';
import {
  fetchTodoItem,
  editTodo,
  addSubtask,
  editSubtask,
  deleteSubtask,
} from '@api/todo';
import getDateDayText from '@/utils/get-date-day-text';
import { BASE_URL } from '@utils/request';

import myDaySmallSvg from '@assets/images/my_day_small.svg';
import myDayBlueSvg from '@assets/images/my_day_bule.svg';
import reminderSvg from '@assets/images/reminder.svg';
import reminderBlueSvg from '@assets/images/reminder_blue.svg';
import dueDateSvg from '@assets/images/due_date.svg';
import dueDateBlueSvg from '@assets/images/due_date_blue.svg';
import repeatSvg from '@assets/images/repeat.svg';
import repeatBlueSvg from '@assets/images/repeat_blue.svg';
import pickACategorySvg from '@assets/images/pick_a_category.svg';
import addFileSvg from '@assets/images/add_file.svg';
import imporantBorderBlueSvg from '@assets/images/important_border_blue.svg';
import importantBlueSvg from '@assets/images/important_blue.svg';
import closeSvg from '@assets/images/close.svg';
import { EditTodoParamsType, Subtask, Todo_List_Item } from '@/types/todo-api';

const { TextArea } = Input;

const DROPDOWN_TYPE = {
  REMINDER: 'reminder',
  DUE_DATE: 'due_date',
  REPEATED: 'repeated',
};

const options = [
  { label: 'orange catory', value: TAG_BG_COLOR_MAP.ORANGE },
  { label: 'red category', value: TAG_BG_COLOR_MAP.RED },
  { label: 'violet category', value: TAG_BG_COLOR_MAP.VIOLET },
  { label: 'green category', value: TAG_BG_COLOR_MAP.GREEN },
  { label: 'yellow category', value: TAG_BG_COLOR_MAP.YELLOW },
  { label: 'blue category', value: TAG_BG_COLOR_MAP.BLUE },
];

interface TagRenderProps {
  label: React.ReactNode;
  value: string;
  closable: boolean;
  onClose: ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void) | undefined
}
const TagRender = (props: TagRenderProps) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color={value}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3, color: TAG_TEXT_COLOR_MAP[value] }}
    >
      {label}
    </Tag>
  );
};

interface TodoDrawerProps {
  drawerOpen: boolean;
  clickedTodo: Todo_List_Item;
  clickedSteps: Subtask[];
  onDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCompleteChange: (item: EditTodoParamsType) => Promise<void>;
  onMarkedAsImportant: (item: EditTodoParamsType) => Promise<void>;
  onUpdateTodo: (todoInfo: EditTodoParamsType) => Promise<void>;
  onClickedTodo: React.Dispatch<React.SetStateAction<Todo_List_Item>>;
  onClickedSteps: React.Dispatch<React.SetStateAction<Subtask[]>>;
  onFetchTodoInDrawer: () => Promise<void>;
}
const TodoDrawer = (props: TodoDrawerProps) => {
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
    onFetchTodoInDrawer,
  } = props;

  const [dropdownOpen, setDropdownOpen] = React.useState<{
    [x: string]: boolean;
  }>({});
  const [addedStep, setAddedStep] = React.useState('');
  const [clickedSubtask, setClickedSubtask] =
    React.useState<Subtask>({} as Subtask);
  const [todoContentFocus, setTodoContentFocus] = React.useState(false);

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

  const handleTodoContentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newClickedTodo = { ...clickedTodo };
    newClickedTodo.content = value;
    onClickedTodo(newClickedTodo);
  };

  const handleTodoContentEdit = async () => {
    await onUpdateTodo({
      id: clickedTodo.id,
      content: clickedTodo.content,
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    onClickedTodo(data);
  };

  const handleTodoContentBlur = () => {
    handleTodoContentEdit();
    setTodoContentFocus(false);
  };

  const handleAddStepInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    await onFetchTodoInDrawer();
    setAddedStep('');
  };

  const handleEditStepInput = (index: number, newContent: string) => {
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
    setClickedSubtask({} as Subtask);
  };

  const handleDeleteStep = async (id: number) => {
    await deleteSubtask({
      id,
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    onClickedTodo(data);
    onClickedSteps(data.subtask);
  };

  const handleCheckedStep = async (clickedStep: Subtask) => {
    await editSubtask({
      id: clickedStep.id,
      marked_as_completed: clickedStep.marked_as_completed
        ? MARKED_AS_UNCOMPLETED
        : MARKED_AS_COMPLETED,
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    onClickedTodo(data);
    onClickedSteps(data.subtask);
    await onFetchTodoInDrawer();
    setClickedSubtask({} as Subtask);
  };

  const handleAddedMyDay = async (added_my_day = ADDED_MY_DAY) => {
    await onUpdateTodo({
      id: clickedTodo.id,
      added_my_day,
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    onClickedTodo(data);
  };

  const handleOpenChange = (key: string, value: boolean) => {
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

  const handleDropdownQuickshortSelect = async (key: string, value: string) => {
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

  const onPickDateOk = (key: string, value: dayjs.Dayjs) => {
    handleDropdownQuickshortSelect(
      key,
      `${value.format('YYYY-MM-DD HH:mm')}:00`
    );
  };

  const handlePickACategoryChange = async (value: string[]) => {
    await onUpdateTodo({
      id: clickedTodo.id,
      // TODO: why return ['', xx] whether accosiated with select options
      category: value.filter(Boolean).join(','),
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    onClickedTodo(data);
  };

  const handleNoteInputChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const newClickedTodo = { ...clickedTodo };
    newClickedTodo.note = value;
    onClickedTodo(newClickedTodo);
  };

  const handleNoteInputBlur = async () => {
    await onUpdateTodo({
      id: clickedTodo.id,
      note: clickedTodo.note,
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    onClickedTodo(data);
  };

  const handleFileUpload = async (file: File) => {
    if (file) {
      const formData = new FormData();
      formData.append('id', clickedTodo.id);
      formData.append('file', file);
      await editTodo(formData);
      const { data } = await fetchTodoItem({ id: clickedTodo.id });
      onClickedTodo(data);
      await onFetchTodoInDrawer();
    }
  };

  const handleFileRemove = async () => {
    await onUpdateTodo({
      id: clickedTodo.id,
      file: null,
      removed_file: clickedTodo.file?.replace(
        // eslint-disable-next-line max-len
        `${BASE_URL}todo-attachment/${clickedTodo.id}/`,
        ''
      ),
    });
    const { data } = await fetchTodoItem({ id: clickedTodo.id });
    onClickedTodo(data);
    await onFetchTodoInDrawer();
  };

  const later4Hour = dayjs().hour() + 4;
  const reminderHour = dayjs(clickedTodo.reminder).hour();
  const reminderMinute = dayjs(clickedTodo.reminder).minute();
  const nextWeekMondayDistance = 7 - dayjs().day() + 1;

  const dayText = getDateDayText(clickedTodo.reminder);
  const dueDateDayText = `Due ${getDateDayText(clickedTodo.due_date)}`;

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
            checked={!!clickedTodo.marked_as_completed}
            onChange={completeTodoInDrawer}
          />
          <div
            // eslint-disable-next-line max-len
            className={`content ${clickedTodo.marked_as_completed ? 'completed' : 'uncompleted'}`}
          >
            {todoContentFocus ? (
              <Input
                autoFocus
                value={clickedTodo.content}
                onChange={handleTodoContentInput}
                onBlur={handleTodoContentBlur}
                onPressEnter={handleTodoContentBlur}
              />
            ) : (
              <span onClick={() => setTodoContentFocus(true)} className="text">
                {clickedTodo.content}
              </span>
            )}
          </div>
          <Icon
            component={() => (
              <img
                src={
                  clickedTodo.marked_as_important === MARKED_AS_IMPORTANT
                    ? importantBlueSvg
                    : imporantBorderBlueSvg
                }
              />
            )}
            onClick={makeImportantTodoInDrawer}
          />
        </div>
        <div className="add-step">
          <div className="steps">
            {clickedSteps.map((item, index) => {
              return (
                <div key={item.id} className="edited-step">
                  <Checkbox
                    checked={!!item.marked_as_completed}
                    onChange={() => handleCheckedStep(item)}
                  />
                  <Input
                    value={item.content}
                    onChange={(e) => handleEditStepInput(index, e.target.value)}
                    onBlur={handleEditStep}
                    onPressEnter={handleEditStep}
                    suffix={
                      <Icon
                        component={() => (
                          <img
                            src={closeSvg}
                            onClick={() => handleDeleteStep(item.id)}
                          />
                        )}
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
          // eslint-disable-next-line max-len
          className={`text ${clickedTodo.added_my_day === ADDED_MY_DAY ? 'added' : ''}`}
        >
          {clickedTodo.added_my_day === ADDED_MY_DAY
            ? 'Added to My Day'
            : 'Add to My Day'}
        </span>
        {!!clickedTodo.added_my_day && (
          <Icon
            component={() => (
              <img
                src={closeSvg}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddedMyDay(UN_ADDED_MY_DAY);
                }}
              />
            )}
          />
        )}
      </div>
      <div className="date-reminder">
        <Dropdown
          placement="bottom"
          trigger={['click']}
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
                  // eslint-disable-next-line max-len
                  ? `Remind me at ${reminderHour > 12 ? reminderHour - 12 : reminderHour}${reminderMinute > 0
                    ? ':' +
                    `${reminderMinute > 10
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
              <Icon
                component={() => (
                  <img
                    src={closeSvg}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDropdownQuickshortSelect(
                        DROPDOWN_TYPE.REMINDER,
                        ''
                      );
                    }}
                  />
                )}
              />
            )}
          </div>
        </Dropdown>
        <Dropdown
          placement="bottom"
          trigger={['click']}
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
                  onChange={(value: dayjs.Dayjs | null) =>
                    handleDropdownQuickshortSelect(
                      DROPDOWN_TYPE.DUE_DATE,
                      (value as dayjs.Dayjs).format('YYYY-MM-DD')
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
                <img src={clickedTodo.due_date ? dueDateBlueSvg : dueDateSvg} />
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
              <Icon
                component={() => (
                  <img
                    src={closeSvg}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDropdownQuickshortSelect(
                        DROPDOWN_TYPE.DUE_DATE,
                        ''
                      );
                    }}
                  />
                )}
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
              handleDropdownQuickshortSelect(
                DROPDOWN_TYPE.REPEATED,
                `${REPEATED}`
              );
            }}
          >
            <span
              className={`time-text ${clickedTodo.repeated ? 'setted' : ''}`}
            >
              Repeat
            </span>
          </div>
          {!!clickedTodo.repeated && (
            <Icon
              component={() => (
                <img
                  src={closeSvg}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownQuickshortSelect(
                      DROPDOWN_TYPE.REPEATED,
                      `${NO_REPEATED}`
                    );
                  }}
                />
              )}
            />
          )}
        </div>
      </div>
      <div className="pick-a-category">
        <Icon component={() => <img src={pickACategorySvg} />} />
        <Select
          mode="multiple"
          placeholder="Pick a category"
          tagRender={TagRender}
          value={clickedTodo.category?.split(',')}
          style={{ width: '100%' }}
          options={options}
          onChange={handlePickACategoryChange}
        />
      </div>
      <div className="add-file">
        <Icon component={() => <img src={addFileSvg} />} />
        <Upload
          name="avatar"
          maxCount={1}
          fileList={
            clickedTodo.file
              ? [
                {
                  uid: clickedTodo.id,
                  name: clickedTodo.file.replace(
                    // eslint-disable-next-line max-len
                    `${BASE_URL}todo-attachment/${clickedTodo.id}/`,
                    ''
                  ),
                  status: 'done',
                  url: clickedTodo.file,
                },
              ]
              : []
          }
          beforeUpload={handleFileUpload}
          onRemove={handleFileRemove}
        >
          <div style={{ marginTop: 8 }}>Add file</div>
        </Upload>
      </div>
      <div className="add-note">
        <TextArea
          value={clickedTodo.note}
          showCount
          rows={4}
          maxLength={1000}
          placeholder="Add note"
          onChange={handleNoteInputChange}
          onBlur={handleNoteInputBlur}
        />
      </div>
    </Drawer>
  );
};

export default TodoDrawer;
