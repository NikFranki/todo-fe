import { ListResponseType } from '@/types/list-api';
import instance from '@utils/request';

export const fetchList = (params = {}) => instance.post('/list/all', params);

export const addList = (params: { name: string; }) => instance.post('/list/add', params);

export const updateList = (params: { id: string, name: string }) => instance.post('/list/update', params);

export const updateListByDragAndDrop = (params: { list: ListResponseType[] }) =>
  instance.post('/list/update-by-drag-and-drop', params);

export const deleteList = (params: { id: string }) => instance.post('/list/delete', params);
