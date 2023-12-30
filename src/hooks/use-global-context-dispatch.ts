import React from 'react';

import { fetchTodoList } from '@api/todo';
import { searchUser } from '@api/user';
import { fetchList } from '@api/list';
import { TODO_RESPONSE_TYPE } from '@/types/todo-api';

const useGlobalContextDispatch = () => {
  const [userInfo, setUserInfo] = React.useState({});
  const [list, setList] = React.useState([]);
  const [fixedList, setFixedList] = React.useState([]);
  const [otherlist, setOtherList] = React.useState([]);
  const [todo, setTodo] = React.useState<TODO_RESPONSE_TYPE['list']>([]);
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
    list_id: number,
    content: string
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
    const res = await fetchList({}) as any;
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
