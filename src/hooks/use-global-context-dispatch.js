import React from 'react';

import { fetchTodoList } from '../api/todo';
import { searchUser } from '../api/user';
import useLists from '../hooks/use-list';
import { DEFAULT_PAGENO, DEFAULT_PAGESIZE } from '../constant';

const useGlobalContextDispatch = () => {
  const [userInfo, setUserInfo] = React.useState({});
  const { lists, onFetchLists } = useLists();
  const [list, setList] = React.useState([]);
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
    setList(res.list);
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

  return {
    userInfo,
    lists,
    list,
    pager,
    todoId,
    authenticated,
    searchText,
    onUserInfoChange,
    onFetchLists,
    onFetchTodo,
    onSetTodoId,
    setAuthenticated,
    onAuthenticated,
    onSetSearchText,
  };
};

export default useGlobalContextDispatch;
