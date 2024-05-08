// Import necessary components and icons
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

const { Header, Footer } = Layout;

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
          <Link to="/">
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              {/* <div className="logo" /> */}
              <HomeOutlined style={{ fontSize: '20px', color: 'white' }} />
              <h2 style={{ color: 'white', marginLeft: '24px' }}>Faire</h2>
            </div>
          </Link>
          {user ? (
            <div style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
              <Link to="/tasks" style={{ display: 'flex', alignItems: 'center' }}>
                <UnorderedListOutlined style={{ fontSize: '20px', color: 'white' }} />
                <span style={{ color: 'white', marginLeft: '8px' }}>Tasks</span>
              </Link>
              <Dropdown
                trigger={['click']}
                overlay={userMenu}
                placement="bottomRight"
              >
                <div style={{ color: 'white', marginRight: '20px', display: 'flex', alignItems: 'center' }}>
                  <Avatar icon={<UserOutlined />} />
                  <span style={{ marginLeft: '8px' }}>{user.displayName ? user.displayName : (user.email ? user.email.split('@')[0] : "Display name")}</span>
                </div>
              </Dropdown>
            </div>
          ) : null}
        </Header>
        <Layout>
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
