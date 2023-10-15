import React from 'react';

import { fetchTodoList } from '../api/todo';
import { searchUser } from '../api/user';
import useFolders from '../hooks/use-folders';
import { DEFAULT_PAGENO, DEFAULT_PAGESIZE, DEFAULT_FOLDER_SEQUENCE } from '../constant';

const useGlobalContextDispatch = () => {
  const [userInfo, setUserInfo] = React.useState({});
  const { folders, onFetchFolders } = useFolders();
  const [list, setList] = React.useState([]);
  const [pager, setPager] = React.useState({ pageNo: DEFAULT_PAGENO, pageSize: DEFAULT_PAGESIZE, total: 0 });
  const [folderParentId, setFolderParentId] = React.useState(DEFAULT_FOLDER_SEQUENCE);
  const [todoId, setTodoId] = React.useState(undefined);
  const [folderParentName, setFolderParentName] = React.useState('');

  React.useEffect(() => {
    onUserInfoChange();
  }, []);

  const onUserInfoChange = async() => {
    const res = await searchUser({});
    setUserInfo(res.data || {});
  };

  const onFetchTodo = async (params) => {
    params = {
      id: todoId,
      parent_id: folderParentId,
      ...params,
      pageNo: DEFAULT_PAGENO,
      pageSize: DEFAULT_PAGESIZE,
    };
    const res = await fetchTodoList(params);
    setList(res.list);
    setPager({
      pageNo: res.pageNo,
      pageSize: res.pageSize,
      total: res.total,
    });
  };

  const onSetFolderParentId = (folderParentId) => {
    setFolderParentId(folderParentId);
  };

  const onSetFolderParentName = (parentName) => {
    setFolderParentName(parentName);
  };

  const onSetTodoId = (todoId) => {
    setTodoId(todoId);
  };

  const values = {
    userInfo,
    folders,
    list,
    pager,
    folderParentId,
    todoId,
    folderParentName,
    onUserInfoChange,
    onFetchFolders,
    onFetchTodo,
    onSetFolderParentId,
    onSetTodoId,
    onSetFolderParentName,
  };

  return values;
};

export default useGlobalContextDispatch;
