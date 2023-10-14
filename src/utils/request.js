const request = (
  url,
  body,
  method = 'post',
  headers = {
    'Content-Type': 'application/json',
  },
) => {
  return fetch(
    url,
    {
      method,
      headers,
      credentials: 'include',
      body,
    }
  ).then((res) => res.json());
};

export default request;