import React, { useState, useEffect, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, ProgressBar } from 'react-bootstrap';
import { Car, TrendingUp, Globe, Calendar, ArrowRight, Fuel } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import styled from 'styled-components';

// Styled components for custom elements
const HeroCard = styled(Card)`
  background: linear-gradient(135deg, #0d6efd 0%, #6f42c1 100%);
  border: none;
  color: white;
  
  .btn {
    background: white;
    color: #0d6efd;
    border: none;
    font-weight: 600;
    
    &:hover {
      background: #f8f9fa;
      color: #0a58ca;
    }
  }
`;

const StatsCard = styled(Card)`
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  transition: all 0.15s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  }
`;

const VehicleCard = styled(Card)`
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  transition: all 0.15s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    
    .card-title {
      color: #0d6efd !important;
    }
  }
`;

// Memoized components for performance
const StatCard = memo(({ icon: Icon, title, value, color = "primary" }) => (
  <Col md={6} lg={3} className="mb-4">
    <StatsCard>
      <Card.Body className="d-flex align-items-center">
        <div className="flex-grow-1">
          <Card.Text className="text-muted mb-1 small">{title}</Card.Text>
          <Card.Title className="mb-0 h4">{value}</Card.Title>
        </div>
        <div className={`bg-${color} bg-opacity-10 p-3 rounded-circle`}>
          <Icon size={24} className={`text-${color}`} />
        </div>
      </Card.Body>
    </StatsCard>
  </Col>
));

const DistributionItem = memo(({ label, count, total, color = "primary" }) => {
  const percentage = ((count / total) * 100).toFixed(1);
  
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="fw-medium">{label}</span>
        <Badge bg="secondary">{count}</Badge>
      </div>
      <ProgressBar variant={color} now={percentage} label={`${percentage}%`} />
    </div>
  );
});

const RecentVehicleCard = memo(({ vehicle }) => (
  <Col md={6} lg={4} className="mb-4">
    <VehicleCard>
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="bg-primary bg-opacity-10 p-2 rounded">
            <Car size={20} className="text-primary" />
          </div>
          <Badge bg="success" className="fs-6">{vehicle.mpg} MPG</Badge>
        </div>
        
        <Card.Title className="h6 mb-3">
          <Link 
            to={`/vehicle/${vehicle.id}`} 
            className="text-decoration-none text-dark line-clamp-2"
          >
            {vehicle.carName}
          </Link>
        </Card.Title>
        
        <Row className="g-2 text-muted small">
          <Col xs={6}>
            <div><strong>Year:</strong> {vehicle.modelYear + 1900}</div>
            <div><strong>Origin:</strong> {vehicle.originName}</div>
          </Col>
          <Col xs={6}>
            <div><strong>Cylinders:</strong> {vehicle.cylinders}</div>
            <div><strong>HP:</strong> {vehicle.horsepower || 'N/A'}</div>
          </Col>
        </Row>
      </Card.Body>
    </VehicleCard>
  </Col>
));

const Dashboard = memo(() => {
  const { vehicles, stats, loading, fetchVehicles, fetchStats } = useVehicleStore();
  const [recentVehicles, setRecentVehicles] = useState([]);

  useEffect(() => {
    fetchVehicles({ limit: 6 });
    fetchStats();
  }, [fetchVehicles, fetchStats]);

  // Memoized calculation for recent vehicles
  const shuffledVehicles = useMemo(() => {
    if (vehicles.length > 0) {
      const shuffled = [...vehicles].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 6);
    }
    return [];
  }, [vehicles]);

  useEffect(() => {
    setRecentVehicles(shuffledVehicles);
  }, [shuffledVehicles]);

  // Memoized stats calculations
  const distributionData = useMemo(() => {
    if (!stats) return { origins: [], cylinders: [] };
    
    const origins = Object.entries(stats.originDistribution || {});
    const cylinders = Object.entries(stats.cylinderDistribution || {})
      .sort(([a], [b]) => parseInt(a) - parseInt(b));
    
    return { origins, cylinders };
  }, [stats]);

  if (loading) {
    return (
      <Container>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      {/* Hero Section */}
      <Row className="mb-5">
        <Col>
          <HeroCard>
            <Card.Body className="p-5">
              <Row className="align-items-center">
                <Col lg={8}>
                  <h1 className="display-4 fw-bold mb-4">Welcome to Auto Explorer</h1>
                  <p className="lead mb-4 opacity-90">
                    Discover and analyze automotive fuel economy data from 1970-1982. 
                    Explore {stats?.totalVehicles || 0} vehicles with comprehensive filtering and visualization tools.
                  </p>
                  <Button 
                    as={Link} 
                    to="/gallery" 
                    size="lg"
                    className="d-inline-flex align-items-center"
                  >
                    <span className="me-2">Explore Gallery</span>
                    <ArrowRight size={18} />
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </HeroCard>
        </Col>
      </Row>

      {/* Stats Grid */}
      <Row className="mb-5">
        <StatCard
          icon={Car}
          title="Total Vehicles"
          value={stats?.totalVehicles || 0}
          color="primary"
        />
        <StatCard
          icon={TrendingUp}
          title="Average MPG"
          value={stats?.avgMpg ? stats.avgMpg.toFixed(1) : '0'}
          color="success"
        />
        <StatCard
          icon={Globe}
          title="Origins"
          value={stats?.originDistribution ? Object.keys(stats.originDistribution).length : 0}
          color="info"
        />
        <StatCard
          icon={Calendar}
          title="Year Range"
          value={stats?.yearRange ? `${stats.yearRange.min}-${stats.yearRange.max}` : '0'}
          color="warning"
        />
      </Row>

      {/* Distribution Charts */}
      {stats?.originDistribution && (
        <Row className="mb-5">
          <Col lg={6} className="mb-4">
            <Card className="h-100">
              <Card.Header className="bg-transparent">
                <Card.Title className="h5 mb-0">Vehicles by Origin</Card.Title>
              </Card.Header>
              <Card.Body>
                {distributionData.origins.map(([origin, count]) => (
                  <DistributionItem
                    key={origin}
                    label={origin}
                    count={count}
                    total={stats.totalVehicles}
                    color={origin === 'USA' ? 'danger' : origin === 'Europe' ? 'info' : 'success'}
                  />
                ))}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-4">
            <Card className="h-100">
              <Card.Header className="bg-transparent">
                <Card.Title className="h5 mb-0">Cylinder Distribution</Card.Title>
              </Card.Header>
              <Card.Body>
                {distributionData.cylinders.map(([cylinders, count]) => (
                  <DistributionItem
                    key={cylinders}
                    label={`${cylinders} cylinders`}
                    count={count}
                    total={stats.totalVehicles}
                    color="primary"
                  />
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Recent Vehicles */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-transparent">
              <div className="d-flex align-items-center justify-content-between">
                <Card.Title className="h5 mb-0">Featured Vehicles</Card.Title>
                <Link 
                  to="/gallery" 
                  className="text-decoration-none d-flex align-items-center"
                >
                  <span className="me-1">View all</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                {recentVehicles.map((vehicle) => (
                  <RecentVehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;