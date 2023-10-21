import React from 'react';

import { fetchList } from '../api/list';

const useLists = () => {
  const [lists, setLists] = React.useState([]);

  const fetchLists = async () => {
    const res = await fetchList({});
    setLists(res.list);
  };

  return {
    lists,
    onFetchLists: fetchLists,
  };
};

export default useLists;