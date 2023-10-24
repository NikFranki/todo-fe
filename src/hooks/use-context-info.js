import React from 'react';

import TodoContext from '../utils/todo-context';

const useContextInfo = () => {
  return React.useContext(TodoContext);
};

export default useContextInfo;
