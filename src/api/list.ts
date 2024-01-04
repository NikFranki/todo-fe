import { LIST_RESPONSE_TYPE, ListItemType } from '@/types/list-api';
import instance from '@utils/request';

export const fetchList = (params = {}): Promise<LIST_RESPONSE_TYPE> => instance.post('/list/all', params);

export const addList = (params: { name: string; }) => instance.post('/list/add', params);

export const updateList = (params: { id: number, name: string }) => instance.post('/list/update', params);

export const updateListByDragAndDrop = (params: { list: ListItemType[] }) =>
  instance.post('/list/update-by-drag-and-drop', params);

export const deleteList = (params: { id: number }) => instance.post('/list/delete', params);
