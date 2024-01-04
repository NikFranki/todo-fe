import React from 'react';

import { fetchTodoList } from '@api/todo';
import { searchUser } from '@api/user';
import { fetchList } from '@api/list';
import { Todo_List_Item } from '@/types/todo-api';
import { ListItemType } from '@/types/list-api';

export interface GlobalContextType {
  userInfo: {
    username: string;
    avatar: string;
  };
  list: ListItemType[];
  todo: Todo_List_Item[];
  todoId: string;
  searchText: string;
  fixedList: ListItemType[];
  otherlist: ListItemType[];
  listItemInfo: {
    id: number;
    name: string;
  };
  authenticatedLoading: boolean;
  onUserInfoChange: () => Promise<void>;
  onFetchList: () => Promise<void>;
  onFetchTodo: (params: {
    list_id?: number;
    content?: string;
  }) => Promise<void>;
  onSetTodoId: (todoId: string) => void;
  onSetSearchText: (searchText: string) => void;
  onSetListItemInfo: (info: {
    id: number;
    name: string;
  }) => void;
};


const useGlobalContextDispatch = () => {
  const [userInfo, setUserInfo] = React.useState<{
    username: string;
    avatar: string;
  }>({
    username: '',
    avatar: ''
  });
  const [list, setList] = React.useState<ListItemType[]>([]);
  const [fixedList, setFixedList] = React.useState<ListItemType[]>([]);
  const [otherlist, setOtherList] = React.useState<ListItemType[]>([]);
  const [todo, setTodo] = React.useState<Todo_List_Item[]>([]);
  const [searchText, setSearchText] = React.useState('');
  const [todoId, setTodoId] = React.useState('');
  const [listItemInfo, setListItemInfo] = React.useState({
    id: 1,
    name: 'My Day',
  });
  const [authenticatedLoading, setAuthenticatedLoading] = React.useState(true);

  const onUserInfoChange = async () => {
    setAuthenticatedLoading(true);
    try {
      const res = await searchUser({});
      setUserInfo(res.data || {});
    } catch (error) {
      /* empty */
    } finally {
      setAuthenticatedLoading(false);
    }
  };

  const onFetchTodo = async (params: {
    list_id?: number,
    content?: string
  }) => {
    const newParams = {
      id: todoId,
      ...params,
    };
    const res = await fetchTodoList(newParams);
    setTodo(res.list);
  };

  const onSetTodoId = (todoId: string) => {
    setTodoId(todoId);
  };

  const onSetListItemInfo = (info: {
    id: number;
    name: string;
  }) => {
    setListItemInfo(info);
  };

  const onSetSearchText = (searchText: string) => {
    setSearchText(searchText);
  };

  const onFetchList = async () => {
    const res = await fetchList({});
    setFixedList(res.list.slice(0, 5));
    setOtherList(res.list.slice(5));
    setList(res.list);
  };

  return {
    userInfo,
    list,
    todo,
    todoId,
    searchText,
    fixedList,
    otherlist,
    listItemInfo,
    authenticatedLoading,
    onUserInfoChange,
    onFetchList,
    onFetchTodo,
    onSetTodoId,
    onSetSearchText,
    onSetListItemInfo,
  };
};

export default useGlobalContextDispatch;
