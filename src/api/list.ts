import instance from '@utils/request';

export const fetchList = (params: any) => instance.post('/list/all', params);

export const addList = (params: any) => instance.post('/list/add', params);

export const updateList = (params: any) => instance.post('/list/update', params);

export const updateListByDragAndDrop = (params: any) =>
  instance.post('/list/update-by-drag-and-drop', params);

export const deleteList = (params: any) => instance.post('/list/delete', params);
