import instance from '../utils/request';

export const fetchGroup = (params) => instance.post('/folders/list', params);

export const addGroup = (params) => instance.post('/folders/add', params);

