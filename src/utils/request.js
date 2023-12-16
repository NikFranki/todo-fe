import axios from 'axios';

export const BASE_URL =
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV === 'production'
    ? 'https://todo-be-psi.vercel.app/'
    : 'http://localhost:8000/';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 30 * 1000,
  // `withCredentials` indicates whether or not cross-site Access-Control requests
  // should be made using credentials
  withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.headers = { gfg_token_header_key: localStorage.getItem('token') };
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default instance;
