import React from 'react';

import { fetchGroup } from '../api/group';

const useFolders = () => {
  const [folders, setFolders] = React.useState([]);

  const fetchFolders = async () => {
    const res = await fetchGroup({});
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