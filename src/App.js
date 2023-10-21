import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import { LoadingOutlined } from '@ant-design/icons';
import TodoContext from './utils/todo-context';
import Register from './register';
import Login from './login';
import Home from './home';
import Profile from './profile';
import ErrorPage from "./error-page";
import useGlobalContextDispatch from './hooks/use-global-context-dispatch';
import { validateToken } from './api/user';

import './App.css';

const ProtectedRoute = ({
  isAllowed,
  children,
  redirectPath = '/login',
}) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

function App() {
  const values = useGlobalContextDispatch();
  const [authenticatedLoading, setAuthenticatedLoading] = React.useState(true);
  const { authenticated, onAuthenticated, onFetchList, onUserInfoChange } = values;

  const doValidateToken = async () => {
    setAuthenticatedLoading(true);
    const res = await validateToken({ token: localStorage.getItem('token') });
    onAuthenticated(res.code === 200);
    setAuthenticatedLoading(false);
  };

  React.useEffect(() => {
    doValidateToken();
    onFetchList();
    onUserInfoChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (authenticatedLoading) {
    return <div className="page-init user-authentication-loading">
      <LoadingOutlined style={{ fontSize: 30, marginBottom: 15 }} />
      loading...
    </div>;
  }

  // Using protect routes, relative link: https://www.robinwieruch.de/react-router-private-routes/

  // Make more compatable with applying permission and roles on protect routes for the fucture
  const permissions = ['analyze'];
  const roles = ['admin'];

  return (
    <TodoContext.Provider value={values}>
      <Router>
        <Routes>
          <Route element={<ProtectedRoute isAllowed={authenticated} />}>
            <Route path='/' element={<Home />} errorElement={<ErrorPage />} />
          </Route>
          <Route
            path="profile"
            element={
              <ProtectedRoute
                redirectPath="/"
                isAllowed={
                  authenticated && permissions.includes('analyze') && roles.includes('admin')
                }
              >
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
        </Routes>
      </Router>
    </TodoContext.Provider>
  );
}

export default App;
