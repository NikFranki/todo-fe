import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom';

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

// let log = console.log;

// const webNotificationApp = () => {
//   try {
//     if ('Notification' in window) {
//       // let ask = window.Notification.requestPermission();
//       let ask = Notification.requestPermission();
//       ask.then(
//         // Permission
//         (permission) => {
//           log(`permission =`, permission);
//           if (permission === 'granted') {
//             log(`permission granted`);
//             let msg = new Notification('App Upgrade Info', {
//               // eslint-disable-next-line max-len
//               body: 'a new version app is available, click download: https://app.xgqfrms.xyz/download',
//               icon: 'https://cdn.xgqfrms.xyz/logo/icon.png',
//             });
//             msg.addEventListener(`click`, (e) => {
//               let btn = e.target.dataset(`btn-type`);
//               if (btn === 'ok') {
//                 log(`OK`);
//               } else {
//                 log(`Cancel`);
//               }
//               alert(`clicked notification`);
//             });
//           } else {
//             log(`notification permission is denied!`);
//           }
//         }
//       );
//     } else {
//       console.warn(
//         `your browser is too old, which not support web notification!`
//       );
//     }
//   } catch (err) {
//     console.error(`error =`, err);
//   }
// };

function App() {
  const values = useGlobalContextDispatch();
  const [authenticatedLoading, setAuthenticatedLoading] = React.useState(true);
  const { authenticated, onAuthenticated, onUserInfoChange } = values;

  const doValidateToken = async () => {
    setAuthenticatedLoading(true);
    const res = await validateToken({
      token: localStorage.getItem('token'),
    });
    onAuthenticated(res.code === 200);
    setAuthenticatedLoading(false);
  };

  React.useEffect(() => {
    // webNotificationApp();
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
    </TodoContext.Provider>
  );
}

s;
var s = '1';

export default App;
