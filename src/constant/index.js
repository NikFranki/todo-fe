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

export const LOCALE_DAY_OF_WEEK = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
]; // 0: Sunday 1: Monday 2: Tuesday 3 Wednesday 4: Thursday 5: Friday 6: Saturday
export const LOCALE_MONTH = [
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

export const NO_REPEATED = 0;
export const REPEATED = 1;

export const TAG_BG_COLOR_MAP = {
  ORANGE: '#fff1e0',
  RED: '#fce9ea',
  VIOLET: '#f0ecf6',
  GREEN: '#e9f9e8',
  YELLOW: '#fffde0',
  BLUE: '#e0f7fd',
};

export const TAG_TEXT_COLOR_MAP = {
  [TAG_BG_COLOR_MAP.ORANGE]: '#a35a00',
  [TAG_BG_COLOR_MAP.RED]: '#d01b2a',
  [TAG_BG_COLOR_MAP.VIOLET]: '#7d57b2',
  [TAG_BG_COLOR_MAP.GREEN]: '#257e20',
  [TAG_BG_COLOR_MAP.YELLOW]: '#7a7400',
  [TAG_BG_COLOR_MAP.BLUE]: '#007899',
};

export const ItemTypes = {
  CARD: 'card',
};
