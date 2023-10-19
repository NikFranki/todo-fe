import React from 'react';

import { fetchGroup } from '../api/group';

const useGroups = () => {
  const [groups, setGroups] = React.useState([]);

  const fetchGroups = async () => {
    const res = await fetchGroup({});
    setGroups(res.list);
  };

  return {
    groups,
    onFetchGroups: fetchGroups,
  };
};

export default useGroups;