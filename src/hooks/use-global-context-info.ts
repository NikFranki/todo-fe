import React from 'react';

import GlobalContext from '@/utils/global-context';

const useGlobalContextInfo = () => {
  return React.useContext(GlobalContext);
};

export default useGlobalContextInfo;
