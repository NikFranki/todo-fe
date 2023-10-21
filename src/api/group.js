import instance from '../utils/request';

export const fetchGroup = (params) => instance.post('/list/all', params);

export const addGroup = (params) => instance.post('/list/add', params);

export const updateGroup = (params) => instance.post('/list/update', params);

export const deleteGroup = (params) => instance.post('/list/delete', params);

