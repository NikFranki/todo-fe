import React from 'react';

import { fetchTodoList } from '../api/todo';
import { searchUser } from '../api/user';
import { fetchList } from '../api/list';
import { DEFAULT_PAGENO, DEFAULT_PAGESIZE } from '../constant';

const useGlobalContextDispatch = () => {
  const [userInfo, setUserInfo] = React.useState({});
  const [list, setList] = React.useState([]);
  const [todo, setTodo] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');
  const [pager, setPager] = React.useState({ pageNo: DEFAULT_PAGENO, pageSize: DEFAULT_PAGESIZE, total: 0 });
  const [todoId, setTodoId] = React.useState(undefined);
  const [authenticated, setAuthenticated] = React.useState(false);

  const onUserInfoChange = async() => {
    const res = await searchUser({});
    setUserInfo(res.data || {});
  };

  const onFetchTodo = async (params) => {
    params = {
      id: todoId,
      ...params,
      pageNo: pager.pageNo,
      pageSize: pager.pageSize,
    };
    const res = await fetchTodoList(params);
    setTodo(res.list);
    setPager({
      pageNo: res.pageNo,
      pageSize: res.pageSize,
      total: res.total,
    });
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
    setList(res.list);
  };

  return {
    userInfo,
    list,
    todo,
    pager,
    todoId,
    authenticated,
    searchText,
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
