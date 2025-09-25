import React, { useState, memo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Offcanvas } from 'react-bootstrap';
import { Car, Home, Grid3x3, Heart, Info, BarChart3, User, LogOut, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import styled from 'styled-components';

// Styled components for custom elements not available in Bootstrap
const StyledNavbar = styled(Navbar)`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  .navbar-brand {
    font-weight: 700;
    color: #0d6efd !important;
    
    &:hover {
      color: #0a58ca !important;
    }
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #0d6efd, #6f42c1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const Layout = memo(() => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, protected: true },
    { name: 'Gallery', href: '/gallery', icon: Grid3x3, protected: true },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, protected: true },
    { name: 'Favorites', href: '/favorites', icon: Heart, protected: true },
    { name: 'About', href: '/about', icon: Info, protected: false },
  ];

  const handleLogout = async () => {
    console.log('Logout button clicked');
    setShowOffcanvas(false);
    logout();
  };

  const filteredNavigation = navigation.filter(item => 
    !item.protected || (item.protected && isAuthenticated)
  );

  const isActive = (href) => location.pathname === href;

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Bootstrap Navbar */}
      <StyledNavbar bg="white" expand="lg" className="sticky-top border-bottom">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <Car size={32} className="me-2 text-primary" />
            Auto Explorer
          </Navbar.Brand>

          {/* Desktop Navigation */}
          <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex">
            <Nav className="me-auto">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Nav.Link
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={`d-flex align-items-center px-3 py-2 ${
                      isActive(item.href) ? 'text-primary fw-semibold' : 'text-secondary'
                    }`}
                  >
                    <Icon size={16} className="me-2" />
                    {item.name}
                  </Nav.Link>
                );
              })}
            </Nav>
            
            {/* Authentication Section */}
            <Nav>
              {isAuthenticated ? (
                <NavDropdown
                  title={
                    <div className="d-flex align-items-center">
                      <UserAvatar className="me-2">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </UserAvatar>
                      <span className="d-none d-xl-inline">{user?.name}</span>
                    </div>
                  }
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.ItemText>
                    <div>
                      <div className="fw-semibold">{user?.name}</div>
                      <small className="text-muted">{user?.email}</small>
                    </div>
                  </NavDropdown.ItemText>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <LogOut size={16} className="me-2" />
                    Sign Out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Link to="/login" className="btn btn-outline-primary btn-sm d-flex align-items-center">
                    <LogIn size={16} className="me-1" />
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm d-flex align-items-center">
                    <User size={16} className="me-1" />
                    Sign Up
                  </Link>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>

          {/* Mobile Toggle */}
          <Navbar.Toggle 
            aria-controls="offcanvas-navbar" 
            className="d-lg-none"
            onClick={() => setShowOffcanvas(true)}
          />
        </Container>
      </StyledNavbar>

      {/* Mobile Offcanvas */}
      <Offcanvas 
        show={showOffcanvas} 
        onHide={() => setShowOffcanvas(false)} 
        placement="end"
        className="d-lg-none"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="d-flex align-items-center">
            <Car size={24} className="me-2 text-primary" />
            Auto Explorer
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Nav.Link
                  key={item.name}
                  as={Link}
                  to={item.href}
                  onClick={() => setShowOffcanvas(false)}
                  className={`d-flex align-items-center py-3 ${
                    isActive(item.href) ? 'text-primary fw-semibold bg-light rounded' : 'text-secondary'
                  }`}
                >
                  <Icon size={18} className="me-3" />
                  {item.name}
                </Nav.Link>
              );
            })}
            
            <hr />
            
            {/* Mobile Authentication */}
            {isAuthenticated ? (
              <div>
                <div className="d-flex align-items-center py-3 px-3 bg-light rounded mb-3">
                  <UserAvatar className="me-3">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </UserAvatar>
                  <div>
                    <div className="fw-semibold">{user?.name}</div>
                    <small className="text-muted">{user?.email}</small>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
                >
                  <LogOut size={16} className="me-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="d-grid gap-2">
                <Link
                  to="/login"
                  onClick={() => setShowOffcanvas(false)}
                  className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                >
                  <LogIn size={16} className="me-2" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setShowOffcanvas(false)}
                  className="btn btn-primary d-flex align-items-center justify-content-center"
                >
                  <User size={16} className="me-2" />
                  Sign Up
                </Link>
              </div>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <main className="container-fluid flex-grow-1 py-4">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-top mt-auto">
        <Container className="py-4">
          <div className="text-center text-muted">
            <p className="mb-1">&copy; 2024 Auto Explorer. Built with React & Express.</p>
            {isAuthenticated && (
              <small className="text-muted">
                Welcome back, {user?.name}!
              </small>
            )}
          </div>
        </Container>
      </footer>
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout;