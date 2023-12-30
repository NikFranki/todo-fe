import instance from '@utils/request';

export const login = (params: any) => instance.post('/user/login', params);

export const logout = (params: any) => instance.post('/user/logout', params);

export const register = (params: any) => instance.post('/user/register', params);

export const searchUser = (params: any) => instance.post('/user/searchUser', params);

export const updateUser = (params: any) => instance.post('/user/update', params);
