import type { GlobalContextType } from '@/hooks/use-global-context-dispatch';
import React from 'react';


const GlobalContext =
  React.createContext<GlobalContextType>({} as GlobalContextType);

export default GlobalContext;
