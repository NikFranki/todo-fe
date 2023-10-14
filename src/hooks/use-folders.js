import React from 'react';

import request from '../utils/request';
import { BASE_URL } from '../config/url';

const useFolders = () => {
  const [folders, setFolders] = React.useState([]);

  const fetchFolders = async () => {
    const res = await request(
      `${BASE_URL}/folders/list`,
    );
    setFolders(res.list);
  };

  React.useEffect(() => {
    fetchFolders();
  }, []);

  return {
    folders,
    onFetchFolders: fetchFolders,
  };
};

export default useFolders;