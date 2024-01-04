import instance from '@utils/request';

export const login = (params: { username: string; password: string; }) => instance.post('/user/login', params);

export const logout = (params = {}) => instance.post('/user/logout', params);

export const register = (params: FormData): Promise<{
  code: number;
  message: string;
}> => instance.post('/user/register', params);

export const searchUser = (params = {}) => instance.post('/user/searchUser', params);

export const updateUser = (params: FormData) => instance.post('/user/update', params);
