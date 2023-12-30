import { COMPLETED_ENUM, IMPORTANT_ENUM, MY_DAY_ENUM } from '@/enum';
import { EditTodoParamsType, TODO_RESPONSE_TYPE } from '@/types/todo-api';
import instance from '@utils/request';

export const fetchTodoList = (params: {
  list_id: number;
  content: string;
  id: string | undefined;
}): Promise<TODO_RESPONSE_TYPE> => instance.post('/todo/list', params);

export const fetchTodoItem = (params: { id: number }) =>
  instance.post('/todo/get_list_by_id', params);

export const addTodo = (params: {
  list_id: number,
  added_my_day: MY_DAY_ENUM;
  marked_as_important: IMPORTANT_ENUM;
  due_date: string | null;
  content: string;
}) => instance.post('/todo/add', params);

export const editTodo = (params: EditTodoParamsType | FormData) => instance.post('/todo/update', params);

export const importTodo = (params: FormData) => instance.post('/todo/import', params);

export const exportTodo = () =>
  instance.get('/todo/export', { responseType: 'blob' });

export const deleteTodo = (params: { id: string }) => instance.post('/todo/delete', params);

export const addSubtask = (params: { todo_id: string; content: string }) => instance.post('/subtask/add', params);

export const editSubtask = (params: {
  id: number;
  content?: string;
  marked_as_completed?: COMPLETED_ENUM;
}) => instance.post('/subtask/update', params);

export const deleteSubtask = (params: { id: number }) =>
  instance.post('/subtask/delete', params);
