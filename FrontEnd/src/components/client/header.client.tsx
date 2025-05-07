import { useState, useEffect } from 'react';
import { CodeOutlined, ContactsOutlined, FireOutlined, LogoutOutlined, MenuFoldOutlined, RiseOutlined, HomeOutlined } from '@ant-design/icons';
import { Avatar, Drawer, Dropdown, MenuProps, Space, message, Button, ConfigProvider, Menu } from 'antd';
import { isMobile } from 'react-device-detect';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { callLogout } from '@/config/api';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import ManageAccount from './modal/manage.account';
import './header.scss'; // Custom SCSS for styling

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
  const user = useAppSelector(state => state.account.user);
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
  const [current, setCurrent] = useState('home');
  const location = useLocation();
  const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location]);

  const items: MenuProps['items'] = [
    {
      label: <Link to={'/'}>Trang Chủ</Link>,
      key: '/',
      icon: <HomeOutlined />,
    },
    {
      label: <Link to={'/job'}>Việc Làm IT</Link>,
      key: '/job',
      icon: <CodeOutlined />,
    },
    {
      label: <Link to={'/company'}>Top Công ty IT</Link>,
      key: '/company',
      icon: <RiseOutlined />,
    },
  ];

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    if (isMobile) setOpenMobileMenu(false);
  };

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.statusCode === 200) {
      dispatch(setLogoutAction({}));
      message.success('Đăng xuất thành công');
      navigate('/');
    }
  };

  const itemsDropdown: MenuProps['items'] = [
    {
      label: <span onClick={() => setOpenManageAccount(true)}>Quản lý tài khoản</span>,
      key: 'manage-account',
      icon: <ContactsOutlined />,
    },
    ...(user?.role?.permissions?.length ? [{
      label: <Link to="/admin">Trang Quản Trị</Link>,
      key: 'admin',
      icon: <FireOutlined />,
    }] : []),
    {
      label: <span onClick={handleLogout}>Đăng xuất</span>,
      key: 'logout',
      icon: <LogoutOutlined />,
    },
  ];

  const itemsMobiles = [...items, ...itemsDropdown];

  return (
    <div className="header-section">
      <div className="container">
        {!isMobile ? (
          <div className="header-desktop">
            <div className="brand" onClick={() => navigate('/')}>
              <span className="brand-text">TIMVIEC</span>
            </div>

            <ConfigProvider
              theme={{
                components: {
                  Menu: {
                    itemHoverColor: '#1890ff',
                    itemSelectedColor: '#1890ff',
                    horizontalItemBorderRadius: 6,
                  },
                },
              }}
            >
              <Menu
                onClick={onClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={items}
                className="main-menu"
              />
            </ConfigProvider>

            <div className="auth-section">
              {isAuthenticated ? (
                <Dropdown menu={{ items: itemsDropdown }} placement="bottomRight">
                  <div className="user-info">
                    <span className="user-name">{user?.name}</span>
                    <Avatar className="user-avatar">
                      {user?.name?.substring(0, 1)?.toUpperCase()}
                    </Avatar>
                  </div>
                </Dropdown>
              ) : (
                <Space>
                  <Button
                    type="text"
                    className="login-btn"
                    onClick={() => navigate('/login')}
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    type="primary"
                    className="register-btn"
                    onClick={() => navigate('/register')}
                  >
                    Đăng ký
                  </Button>
                </Space>
              )}
            </div>
          </div>
        ) : (
          <div className="header-mobile">
            <div className="mobile-brand" onClick={() => navigate('/')}>
              TIMVIEC
            </div>
            <MenuFoldOutlined
              className="mobile-menu-icon"
              onClick={() => setOpenMobileMenu(true)}
            />
          </div>
        )}
      </div>

      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setOpenMobileMenu(false)}
        open={openMobileMenu}
        className="mobile-drawer"
      >
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="inline"
          items={itemsMobiles}
          className="mobile-menu"
        />
      </Drawer>

      <ManageAccount
        open={openMangeAccount}
        onClose={setOpenManageAccount}
      />
    </div>
  );
};

export default Header;