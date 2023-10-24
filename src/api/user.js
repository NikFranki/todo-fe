import instance from '../utils/request';

export const login = (params) => instance.post('/user/login', params);

export const logout = (params) => instance.post('/user/logout', params);

export const register = (params) => instance.post('/user/register', params);

export const searchUser = (params) => instance.post('/user/searchUser', params);

export const updateUser = (params) => instance.post('/user/update', params);

export const validateToken = (params) =>
  instance.post('/jwt/tokenValidate', params);
