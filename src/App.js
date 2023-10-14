import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import TodoContext from './utils/todo-context';
import Register from './register';
import Login from './login';
import Home from './home';
import Profile from './profile';
import ErrorPage from "./error-page";
import useGlobalContextDispatch from './hooks/use-global-context-dispatch';

import './App.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);

function App() {
  const values = useGlobalContextDispatch();

  return (
    <TodoContext.Provider value={values}>
      <RouterProvider router={router} />
    </TodoContext.Provider>
  );
}

export default App;
