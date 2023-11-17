import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom';

import { notification } from 'antd';

import io from 'socket.io-client';

import { LoadingOutlined } from '@ant-design/icons';
import TodoContext from './utils/todo-context';
import Register from './pages/register';
import Login from './pages/login';
import Home from './pages/home';
import Profile from './pages/profile';
import ErrorPage from './error-page';
import useGlobalContextDispatch from './hooks/use-global-context-dispatch';
import { validateToken } from './api/user';

import './App.css';

const ProtectedRoute = ({ isAllowed, children, redirectPath = '/login' }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

function App() {
  const values = useGlobalContextDispatch();
  const [authenticatedLoading, setAuthenticatedLoading] = React.useState(true);
  const { authenticated, onAuthenticated, onUserInfoChange } = values;
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (todoItem, index) => {
    return new Promise((resolve, reject) => {
      try {
        const time = index * 500;
        setTimeout(() => {
          api.open({
            message: `Reminder: ${todoItem.content}`,
            description: '',
            duration: 0,
          });
          resolve();
        }, time);
      } catch (error) {
        reject(error);
      }
    });
  };

  React.useEffect(() => {
    const socketInstance = io('http://localhost:8000');

    // listen for events emitted by the server
    socketInstance.on('connect', () => {
      console.log('Connected to server');
    });

    socketInstance.on('todo-message', (data) => {
      console.log(`Received todo message:`, data);
      let chain = Promise.resolve();
      if (Array.isArray(data) && data.length) {
        data.forEach((todoItem, index) => {
          chain.then(() => openNotification(todoItem, index));
        });
      }
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doValidateToken = async () => {
    setAuthenticatedLoading(true);
    const res = await validateToken({
      token: localStorage.getItem('token'),
    });
    onAuthenticated(res.code === 200);
    setAuthenticatedLoading(false);
  };

  React.useEffect(() => {
    doValidateToken();
    onUserInfoChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (authenticatedLoading) {
    return (
      <div className="page-init user-authentication-loading">
        <LoadingOutlined style={{ fontSize: 30, marginBottom: 15 }} />
        loading...
      </div>
    );
  }

  // Using protect routesrelative link: https://www.robinwieruch.de/react-router-private-routes/

  // Make more compatable with applying permission and roles on protect routes for the fucture
  const permissions = ['analyze'];
  const roles = ['admin'];

  return (
    <TodoContext.Provider value={values}>
      <Router>
        <Routes>
          <Route element={<ProtectedRoute isAllowed={authenticated} />}>
            <Route path="/" element={<Home />} errorElement={<ErrorPage />} />
          </Route>
          <Route
            path="profile"
            element={
              <ProtectedRoute
                redirectPath="/"
                isAllowed={
                  authenticated &&
                  permissions.includes('analyze') &&
                  roles.includes('admin')
                }
              >
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Routes>
      </Router>
      {contextHolder}
    </TodoContext.Provider>
  );
}

s;
var s = '1';

export default App;
