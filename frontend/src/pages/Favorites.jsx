import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Car, Trash2, Share2, Download, Calendar, Fuel } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

const Favorites = () => {
  const { favorites, removeFromFavorites, toggleFavorite } = useVehicleStore();
  const [sortBy, setSortBy] = useState('addedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const sortedFavorites = [...favorites].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (typeof aVal === 'string') {
      return sortOrder === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const exportFavorites = () => {
    const data = favorites.map(vehicle => ({
      name: vehicle.carName,
      mpg: vehicle.mpg,
      year: vehicle.modelYear + 1900,
      origin: vehicle.originName,
      cylinders: vehicle.cylinders,
      horsepower: vehicle.horsepower,
    }));

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favorite-vehicles.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearAllFavorites = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      favorites.forEach(vehicle => removeFromFavorites(vehicle.id));
    }
  };

  if (favorites.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6} className="text-center">
            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{width: '96px', height: '96px'}}>
              <Heart size={48} className="text-muted" />
            </div>
            <h2 className="h3 fw-semibold text-dark mb-3">No favorites yet</h2>
            <p className="text-muted mb-4">
              Start exploring vehicles and click the heart icon to add them to your favorites collection.
            </p>
            <Link to="/gallery" className="btn btn-primary">
              Browse Vehicles
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-5">
        <Col>
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between">
            <div className="mb-3 mb-sm-0">
              <h1 className="h2 fw-bold text-dark mb-1">My Favorites</h1>
              <p className="text-muted mb-0">
                {favorites.length} vehicle{favorites.length !== 1 ? 's' : ''} saved
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-secondary"
                onClick={exportFavorites}
                className="d-flex align-items-center"
              >
                <Download size={16} className="me-2" />
                Export CSV
              </Button>

              <Button
                variant="outline-danger"
                onClick={clearAllFavorites}
                className="d-flex align-items-center"
              >
                <Trash2 size={16} className="me-2" />
                Clear All
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Stats Overview */}
      <Row className="mb-5">
        <Col xs={12} md={6} lg={3} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted small mb-1">Average MPG</p>
                <p className="h4 fw-bold text-dark mb-0">
                  {(favorites.reduce((sum, v) => sum + v.mpg, 0) / favorites.length).toFixed(1)}
                </p>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded">
                <Fuel size={24} className="text-success" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted small mb-1">Best MPG</p>
                <p className="h4 fw-bold text-dark mb-0">
                  {Math.max(...favorites.map(v => v.mpg))}
                </p>
              </div>
              <div className="bg-danger bg-opacity-10 p-3 rounded">
                <Heart size={24} className="text-danger" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted small mb-1">Most Common Origin</p>
                <p className="h4 fw-bold text-dark mb-0">
                  {Object.entries(
                    favorites.reduce((acc, v) => {
                      acc[v.originName] = (acc[v.originName] || 0) + 1;
                      return acc;
                    }, {})
                  ).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                </p>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded">
                <Calendar size={24} className="text-primary" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted small mb-1">Total Saved</p>
                <p className="h4 fw-bold text-dark mb-0">{favorites.length}</p>
              </div>
              <div className="bg-info bg-opacity-10 p-3 rounded">
                <Car size={24} className="text-info" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sort Controls */}
      <Row className="mb-5">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className="fw-semibold text-dark small me-2">Sort by:</span>
                {[
                  { key: 'addedAt', label: 'Date Added' },
                  { key: 'mpg', label: 'MPG' },
                  { key: 'carName', label: 'Name' },
                  { key: 'modelYear', label: 'Year' },
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    variant={sortBy === key ? 'primary' : 'outline-secondary'}
                    size="sm"
                    onClick={() => handleSort(key)}
                    className="rounded-pill"
                  >
                    {label}
                    {sortBy === key && (
                      <span className="ms-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Favorites Grid */}
      <Row className="mb-5">
        {sortedFavorites.map((vehicle) => (
          <Col md={6} lg={4} key={vehicle.id} className="mb-4">
            <FavoriteCard
              vehicle={vehicle}
              onRemove={() => removeFromFavorites(vehicle.id)}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

// Favorite Card Component
const FavoriteCard = ({ vehicle, onRemove }) => {
  const [showActions, setShowActions] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `${vehicle.carName} - Auto Explorer`,
      text: `Check out this ${vehicle.carName} with ${vehicle.mpg} MPG!`,
      url: `${window.location.origin}/vehicle/${vehicle.id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card
      className="h-100 border-0 shadow-sm position-relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{transition: 'all 0.15s ease-in-out'}}
    >
      {/* Actions overlay */}
      <div className={`position-absolute top-0 end-0 p-2 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
        <Button
          variant="light"
          size="sm"
          className="rounded-circle shadow-sm me-1"
          onClick={handleShare}
          title="Share"
        >
          <Share2 size={14} />
        </Button>
        <Button
          variant="light"
          size="sm"
          className="rounded-circle shadow-sm text-danger"
          onClick={onRemove}
          title="Remove from favorites"
        >
          <Trash2 size={14} />
        </Button>
      </div>

      <Card.Body>
        {/* Vehicle icon and favorite indicator */}
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="bg-primary bg-opacity-10 p-2 rounded">
            <Car size={20} className="text-primary" />
          </div>
          <div className="d-flex align-items-center gap-2">
            <Heart size={16} className="text-danger" fill="currentColor" />
            <small className="text-muted">
              {formatDate(vehicle.addedAt)}
            </small>
          </div>
        </div>

        {/* Vehicle details */}
        <Link to={`/vehicle/${vehicle.id}`} className="text-decoration-none">
          <h5 className="fw-semibold text-dark mb-3 line-clamp-2" style={{minHeight: '3rem'}}>
            {vehicle.carName}
          </h5>
        </Link>

        <div className="mb-3">
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
        </div>

        {/* MPG highlight */}
        <div className="d-flex align-items-center justify-content-between pt-3 border-top">
          <div className="d-flex align-items-center text-muted">
            <Fuel size={16} className="me-1" />
            <small>Fuel Economy</small>
          </div>
          <Badge bg="success" className="fs-6">{vehicle.mpg} MPG</Badge>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Favorites;