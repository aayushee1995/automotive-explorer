import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Lazy load components for better performance
const Layout = lazy(() => import('./components/Layout'));
const AuthLayout = lazy(() => import('./components/AuthLayout'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Gallery = lazy(() => import('./pages/Gallery'));
const VehicleDetail = lazy(() => import('./pages/VehicleDetail'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Favorites = lazy(() => import('./pages/Favorites'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

// Error boundary for lazy loading
class LazyLoadErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container text-center py-5">
          <h3 className="text-danger mb-3">Something went wrong</h3>
          <p className="text-muted">Please refresh the page to try again.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const initializeAuth = useAuthStore(state => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <LazyLoadErrorBoundary>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<AuthLayout />}>
              <Route index element={<Login />} />
            </Route>
            <Route path="/register" element={<AuthLayout />}>
              <Route index element={<Register />} />
            </Route>

            {/* Main Application Routes */}
            <Route path="/" element={<Layout />}>
              <Route 
                index 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  </Suspense>
                } 
              />
              <Route 
                path="gallery" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProtectedRoute>
                      <Gallery />
                    </ProtectedRoute>
                  </Suspense>
                } 
              />
              <Route 
                path="vehicle/:id" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProtectedRoute>
                      <VehicleDetail />
                    </ProtectedRoute>
                  </Suspense>
                } 
              />
              <Route 
                path="analytics" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  </Suspense>
                } 
              />
              <Route 
                path="favorites" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  </Suspense>
                } 
              />
              <Route 
                path="about" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <About />
                  </Suspense>
                } 
              />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </LazyLoadErrorBoundary>
  );
}

export default App;
