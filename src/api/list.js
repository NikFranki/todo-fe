import instance from '@utils/request';

export const fetchList = (params) => instance.post('/list/all', params);

export const addList = (params) => instance.post('/list/add', params);

export const updateList = (params) => instance.post('/list/update', params);

export const deleteList = (params) => instance.post('/list/delete', params);
