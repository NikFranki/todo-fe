import instance from '@utils/request';

export const fetchTodoList = (params: any) => instance.post('/todo/list', params);

export const fetchTodoItem = (params: any) =>
  instance.post('/todo/get_list_by_id', params);

export const addTodo = (params: any) => instance.post('/todo/add', params);

export const editTodo = (params: any) => instance.post('/todo/update', params);

export const importTodo = (params: any) => instance.post('/todo/import', params);

export const exportTodo = () =>
  instance.get('/todo/export', { responseType: 'blob' });

export const deleteTodo = (params: any) => instance.post('/todo/delete', params);

export const addSubtask = (params: any) => instance.post('/subtask/add', params);

export const editSubtask = (params: any) => instance.post('/subtask/update', params);

export const deleteSubtask = (params: any) =>
  instance.post('/subtask/delete', params);
