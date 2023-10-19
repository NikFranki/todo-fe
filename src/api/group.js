import instance from '../utils/request';

export const fetchGroup = (params) => instance.post('/groups/list', params);

export const addGroup = (params) => instance.post('/groups/add', params);

