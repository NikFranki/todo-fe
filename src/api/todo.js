import instance from '@utils/request';

export const fetchTodoList = (params) => instance.post('/todo/list', params);

export const fetchTodoItem = (params) =>
  instance.post('/todo/get_list_by_id', params);

export const addTodo = (params) => instance.post('/todo/add', params);

export const editTodo = (params) => instance.post('/todo/update', params);

export const importTodo = (params) => instance.post('/todo/import', params);

export const exportTodo = () =>
  instance.get('/todo/export', { responseType: 'blob' });

export const deleteTodo = (params) => instance.post('/todo/delete', params);
