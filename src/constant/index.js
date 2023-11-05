import React from 'react';

import {
  HomeOutlined,
  ScheduleOutlined,
  UserOutlined,
  FireOutlined,
  StarOutlined,
} from '@ant-design/icons';

// default list: [My Day->1, Important->2, Planned->3, Assigned to me->4, Tasks->5]
export const FIXED_LIST_ITEM_MY_DAY = 1;
export const FIXED_LIST_ITEM_IMPORTANT = 2;
export const FIXED_LIST_ITEM_PLANNED = 3;
export const FIXED_LIST_ITEM_ASSIGNED_TO_ME = 4;
export const FIXED_LIST_ITEM_TASKS = 5;

export const MARKED_AS_UNIMPORTANT = 0;
export const MARKED_AS_IMPORTANT = 1;

export const MARKED_AS_UNCOMPLETED = 0;
export const MARKED_AS_COMPLETED = 1;

export const UN_ADDED_MY_DAY = 0;
export const ADDED_MY_DAY = 1;

export const LIST_ICON_MAP = {
  [FIXED_LIST_ITEM_MY_DAY]: (
    <FireOutlined key="today-icon" className="today-icon" />
  ),
  [FIXED_LIST_ITEM_IMPORTANT]: (
    <StarOutlined key="important-icon" className="important-icon" />
  ),
  [FIXED_LIST_ITEM_PLANNED]: (
    <ScheduleOutlined key="planned-icon" className="planned-icon" />
  ),
  [FIXED_LIST_ITEM_ASSIGNED_TO_ME]: (
    <UserOutlined key="assigned-icon" className="assigned-icon" />
  ),
  [FIXED_LIST_ITEM_TASKS]: (
    <HomeOutlined key="tasks-icon" className="tasks-icon" />
  ),
};
