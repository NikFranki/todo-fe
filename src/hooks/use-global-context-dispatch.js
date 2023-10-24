import React from 'react';

import { fetchTodoList } from '../api/todo';
import { searchUser } from '../api/user';
import { fetchList } from '../api/list';

const useGlobalContextDispatch = () => {
  const [userInfo, setUserInfo] = React.useState({});
  const [list, setList] = React.useState([]);
  const [fixedList, setFixedList] = React.useState([]);
  const [otherlist, setOtherList] = React.useState([]);
  const [todo, setTodo] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');
  const [todoId, setTodoId] = React.useState(undefined);
  const [authenticated, setAuthenticated] = React.useState(false);

  const onUserInfoChange = async () => {
    const res = await searchUser({});
    setUserInfo(res.data || {});
  };

  const onFetchTodo = async (params) => {
    params = {
      id: todoId,
      ...params,
    };
    const res = await fetchTodoList(params);
    setTodo(res.list);
  };

  const onSetTodoId = (todoId) => {
    setTodoId(todoId);
  };

  const onAuthenticated = (authenticated) => {
    setAuthenticated(authenticated);
  };

  const onSetSearchText = (searchText) => {
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
    authenticated,
    searchText,
    fixedList,
    otherlist,
    onUserInfoChange,
    onFetchList,
    onFetchTodo,
    onSetTodoId,
    setAuthenticated,
    onAuthenticated,
    onSetSearchText,
  };
};

export default useGlobalContextDispatch;
