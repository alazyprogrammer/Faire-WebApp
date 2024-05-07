import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Avatar, Layout, Menu, Dropdown, message } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined, HomeOutlined, UnorderedListOutlined } from '@ant-design/icons'; // Added UnorderedListOutlined for the tasks icon
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Profile from './Pages/Profile';
import Tasks from './Pages/Tasks'; // Imported Tasks component
import { useAuth } from './Components/Contexts/AuthContext';
import { signOutUser } from './Firebase/auth';

const { Header, Sider, Footer } = Layout;

const App = () => {
  const { user, loading } = useAuth();

  // Output user details to console
  if (user) {
    console.log('User details:', user);
  }

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOutUser();
      message.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      message.error('Failed to logout. Please try again.');
    }
  };

  // Dropdown menu for user actions (profile settings, logout)
  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<SettingOutlined />}>
        <Link to="/profile">Profile Settings</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo" />
          <h1 style={{ color: 'white', marginLeft: '24px' }}>Faire</h1>
          {user ? (
            <Dropdown
              trigger={['click']}
              overlay={userMenu}
              placement="bottomRight"
            >
              <div style={{ color: 'white', marginRight: '24px' }}>
                <Avatar icon={<UserOutlined />} />
                <span style={{ marginLeft: '8px' }}>{user.displayName}</span>
              </div>
            </Dropdown>
          ) : null}
        </Header>
        <Layout>
          {user && (
            <Sider width={240} style={{ background: '#fff', margin: '2em', width: '80%' }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{ height: '100%', borderRight: 0 }}
              >
                <Menu.Item key="1" icon={<HomeOutlined />}>
                  <Link to="/">Home</Link>
                </Menu.Item>
                {/* Add a menu item for Tasks */}
                <Menu.Item key="2" icon={<UnorderedListOutlined />}>
                  <Link to="/tasks">Tasks</Link>
                </Menu.Item>
                {/* Add more sidebar menu items as needed */}
              </Menu>
            </Sider>
          )}
          <Routes>
              <Route path="/" element={user ? <Home /> : <Navigate to="/signup" />} />
              <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/" />} />
              <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
              <Route path="/tasks" element={user ? <Tasks /> : <Navigate to="/" />} /> {/* Added route for Tasks page */}
            </Routes>
        </Layout>
        <Footer style={{ textAlign: 'center' }}>Faire ©2024 Created by <a href='https://github.com/alazyprogrammer'>AlazyProgrammer</a></Footer>
      </Layout>
    </Router>
  );
};

export default App;
