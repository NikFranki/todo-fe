import type { ValuesType } from '@/hooks/use-global-context-dispatch';
import React from 'react';


const TodoContext = React.createContext<ValuesType | null>(null);

export default TodoContext;
