import instance from '../utils/request';

export const fetchTodoList = (params) => instance.post('/list', params);

export const fetchTodoListById = (params) => instance.post('/get_list_by_id', params);

export const addTodo = (params) => instance.post('/add', params);

export const editTodo = (params) => instance.post('/update', params);

export const importTodo = (params) => instance.post('/import', params);

export const exportTodo = () => instance.get('/export', { responseType: 'blob' });

export const deleteodo = (params) => instance.post('/delete', params);

