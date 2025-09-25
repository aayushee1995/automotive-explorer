import React, { useState, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Car, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import styled from 'styled-components';

// Styled components
const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
`;

const BrandIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #0d6efd, #6f42c1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  
  li {
    padding: 0.5rem 0;
    position: relative;
    padding-left: 1.5rem;
    
    &:before {
      content: '•';
      position: absolute;
      left: 0;
      font-size: 1.2rem;
    }
    
    &:nth-child(1):before { color: #0d6efd; }
    &:nth-child(2):before { color: #198754; }
    &:nth-child(3):before { color: #6f42c1; }
    &:nth-child(4):before { color: #dc3545; }
  }
`;

const Login = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);

  // Redirect destination after successful login
  const from = location.state?.from?.pathname || '/';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
    
    // Reset validation state
    if (validated) {
      setValidated(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    const result = await login(formData);
    
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleDemoLogin = async () => {
    const demoCredentials = {
      email: 'demo@autoexplorer.com',
      password: 'demo123',
    };
    
    setFormData(demoCredentials);
    
    const result = await login(demoCredentials);
    
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <LoginContainer className="d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="shadow border-0">
              <Card.Body className="p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <BrandIcon>
                    <Car size={40} color="white" />
                  </BrandIcon>
                  <h2 className="fw-bold mb-2">Welcome Back</h2>
                  <p className="text-muted">Sign in to your Auto Explorer account</p>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="danger" className="d-flex align-items-center">
                    <div>{error}</div>
                  </Alert>
                )}

                {/* Login Form */}
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  {/* Email */}
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <Mail size={16} />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email address.
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <Lock size={16} />
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        minLength={6}
                        required
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        Password must be at least 6 characters.
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  {/* Submit Button */}
                  <div className="d-grid gap-2 mb-3">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                      className="d-flex align-items-center justify-content-center"
                    >
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Signing in...
                        </>
                      ) : (
                        <>
                          <LogIn size={18} className="me-2" />
                          Sign In
                        </>
                      )}
                    </Button>

                    {/* Demo Login */}
                    <Button
                      type="button"
                      variant="outline-primary"
                      onClick={handleDemoLogin}
                      disabled={loading}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <Car size={16} className="me-2" />
                      Try Demo Account
                    </Button>
                  </div>
                </Form>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-muted mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-decoration-none fw-semibold">
                      Create one now
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>

            {/* Features Preview */}
            <Card className="mt-4 bg-light border-0">
              <Card.Body>
                <h5 className="text-center mb-3">Why Create an Account?</h5>
                <FeatureList>
                  <li className="text-muted small">Save unlimited favorite vehicles</li>
                  <li className="text-muted small">Sync preferences across devices</li>
                  <li className="text-muted small">Create custom vehicle collections</li>
                  <li className="text-muted small">Access advanced analytics features</li>
                </FeatureList>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </LoginContainer>
  );
});

Login.displayName = 'Login';

export default Login;