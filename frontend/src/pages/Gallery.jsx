import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, ButtonGroup, Table } from 'react-bootstrap';
import { Search, Filter, Grid, List, Heart, Car, Calendar, Fuel, Table as TableIcon } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
// import {
//   useReactTable,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   flexRender,
// } from '@tanstack/react-table';
import styled from 'styled-components';

// Styled components
const FilterCard = styled(Card)`
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  animation: slideDown 0.3s ease-out;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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

const ReactTable = styled.div`
  .table-responsive {
    border-radius: 0.375rem;
    border: 1px solid #dee2e6;
    overflow-x: auto;
  }

  .table {
    margin-bottom: 0;
    min-width: 800px;
  }

  .table thead th {
    background-color: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
    font-weight: 600;
    cursor: pointer;
    user-select: none;
    vertical-align: middle;
    white-space: nowrap;

    &:hover {
      background-color: #e9ecef;
    }
  }

  .table tbody tr:hover {
    background-color: #f8f9fa;
  }

  .sortable-indicator {
    display: inline-block;
    margin-left: 0.25rem;
    font-size: 0.75rem;
    opacity: 0.7;
  }
`;

// Memoized components
const VehicleGridCard = memo(({ vehicle, isFavorite, onToggleFavorite }) => (
  <Col md={6} lg={4} xl={3} className="mb-4">
    <VehicleCard>
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="bg-primary bg-opacity-10 p-2 rounded">
            <Car size={20} className="text-primary" />
          </div>
          <div className="d-flex align-items-center gap-2">
            <Badge bg="success">{vehicle.mpg} MPG</Badge>
            <Button
              variant="link"
              size="sm"
              className="p-1"
              onClick={() => onToggleFavorite(vehicle)}
            >
              <Heart 
                size={16} 
                className={isFavorite ? 'text-danger' : 'text-muted'}
                fill={isFavorite ? 'currentColor' : 'none'}
              />
            </Button>
          </div>
        </div>
        
        <Card.Title className="h6 mb-3 line-clamp-2">
          <Link 
            to={`/vehicle/${vehicle.id}`} 
            className="text-decoration-none text-dark"
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

const VehicleListCard = memo(({ vehicle, isFavorite, onToggleFavorite }) => (
  <Card className="mb-3">
    <Card.Body>
      <Row className="align-items-center">
        <Col xs={2} md={1}>
          <div className="bg-primary bg-opacity-10 p-2 rounded text-center">
            <Car size={20} className="text-primary" />
          </div>
        </Col>
        <Col xs={6} md={7}>
          <Card.Title className="h6 mb-1">
            <Link 
              to={`/vehicle/${vehicle.id}`} 
              className="text-decoration-none text-dark"
            >
              {vehicle.carName}
            </Link>
          </Card.Title>
          <div className="text-muted small">
            <span className="me-3">
              <Calendar size={12} className="me-1" />
              {vehicle.modelYear + 1900}
            </span>
            <span className="me-3">{vehicle.cylinders} cyl</span>
            <span className="me-3">{vehicle.originName}</span>
            <span>{vehicle.horsepower || 'N/A'} HP</span>
          </div>
        </Col>
        <Col xs={2} md={2} className="text-center">
          <Badge bg="success" className="fs-6">{vehicle.mpg} MPG</Badge>
        </Col>
        <Col xs={2} md={2} className="text-end">
          <Button
            variant="link"
            size="sm"
            className="p-1"
            onClick={() => onToggleFavorite(vehicle)}
          >
            <Heart 
              size={18} 
              className={isFavorite ? 'text-danger' : 'text-muted'}
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </Button>
        </Col>
      </Row>
    </Card.Body>
  </Card>
));

const Gallery = memo(() => {
  const {
    vehicles,
    loading,
    filters,
    pagination,
    updateFilters,
    clearFilters,
    fetchVehicles,
    updatePagination,
    toggleFavorite,
    isFavorite,
  } = useVehicleStore();

  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Debounced filter application
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFilters(localFilters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localFilters, updateFilters]);

  // Fetch vehicles when filters or pagination change
  useEffect(() => {
    fetchVehicles();
  }, [filters, pagination.page, fetchVehicles]);

  // Memoized filter change handler
  const handleFilterChange = useCallback((key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSortChange = useCallback((sortBy) => {
    const newOrder = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    updateFilters({ sortBy, sortOrder: newOrder });
  }, [filters.sortBy, filters.sortOrder, updateFilters]);

  const handlePageChange = useCallback((page) => {
    updatePagination({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [updatePagination]);

  // React Table Configuration
  const columns = useMemo(
    () => [
      {
        header: 'Vehicle',
        accessorKey: 'carName',
        size: 300,
        cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
              <Car size={16} className="text-primary" />
            </div>
            <div>
              <Link
                to={`/vehicle/${row.original.id}`}
                className="text-decoration-none fw-semibold"
              >
                {row.original.carName}
              </Link>
              <div className="text-muted small">
                {row.original.modelYear + 1900} • {row.original.originName}
              </div>
            </div>
          </div>
        ),
      },
      {
        header: 'MPG',
        accessorKey: 'mpg',
        size: 80,
        cell: ({ getValue }) => (
          <Badge bg="success" className="fs-6">{getValue()}</Badge>
        ),
      },
      {
        header: 'Cylinders',
        accessorKey: 'cylinders',
        size: 100,
      },
      {
        header: 'Horsepower',
        accessorKey: 'horsepower',
        size: 110,
        cell: ({ getValue }) => getValue() || 'N/A',
      },
      {
        header: 'Weight',
        accessorKey: 'weight',
        size: 100,
        cell: ({ getValue }) => `${getValue()} lbs`,
      },
      {
        header: 'Origin',
        accessorKey: 'originName',
        size: 100,
      },
      {
        header: 'Actions',
        id: 'actions',
        size: 80,
        cell: ({ row }) => (
          <Button
            variant="link"
            size="sm"
            className="p-1"
            onClick={() => toggleFavorite(row.original)}
          >
            <Heart
              size={16}
              className={isFavorite(row.original.id) ? 'text-danger' : 'text-muted'}
              fill={isFavorite(row.original.id) ? 'currentColor' : 'none'}
            />
          </Button>
        ),
      },
    ],
    [toggleFavorite, isFavorite]
  );

  // const table = useReactTable({
  //   data: vehicles,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   initialState: {
  //     pagination: {
  //       pageSize: 10,
  //     },
  //   },
  // });

  const origins = [
    { id: '', name: 'All Origins' },
    { id: '1', name: 'USA' },
    { id: '2', name: 'Europe' },
    { id: '3', name: 'Japan' },
  ];

  const cylinderOptions = [
    { id: '', name: 'All Cylinders' },
    { id: '3', name: '3 cylinders' },
    { id: '4', name: '4 cylinders' },
    { id: '5', name: '5 cylinders' },
    { id: '6', name: '6 cylinders' },
    { id: '8', name: '8 cylinders' },
  ];

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  if (loading) {
    return (
      <Container>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading vehicles...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
            <div>
              <h1 className="h3 fw-bold mb-1">Vehicle Gallery</h1>
              <p className="text-muted mb-0">{pagination.total} vehicles found</p>
            </div>
            
            <div className="d-flex align-items-center gap-2 mt-3 mt-sm-0">
              <Button
                variant={showFilters ? "primary" : "outline-secondary"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="d-flex align-items-center"
              >
                <Filter size={16} className="me-1" />
                Filters
              </Button>
              
              <ButtonGroup size="sm">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline-secondary'}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={16} />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline-secondary'}
                  onClick={() => setViewMode('list')}
                >
                  <List size={16} />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'primary' : 'outline-secondary'}
                  onClick={() => setViewMode('table')}
                >
                  <TableIcon size={16} />
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </Col>
      </Row>

      {/* Filters Panel */}
      {showFilters && (
        <Row className="mb-4">
          <Col>
            <FilterCard>
              <Card.Body>
                <Row className="g-3">
                  {/* Search */}
                  <Col lg={6}>
                    <Form.Label>Search</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <Search size={16} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search by car name..."
                        value={localFilters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                      />
                    </InputGroup>
                  </Col>

                  {/* Origin */}
                  <Col md={6} lg={3}>
                    <Form.Label>Origin</Form.Label>
                    <Form.Select
                      value={localFilters.origin}
                      onChange={(e) => handleFilterChange('origin', e.target.value)}
                    >
                      {origins.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  {/* Cylinders */}
                  <Col md={6} lg={3}>
                    <Form.Label>Cylinders</Form.Label>
                    <Form.Select
                      value={localFilters.cylinders}
                      onChange={(e) => handleFilterChange('cylinders', e.target.value)}
                    >
                      {cylinderOptions.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  {/* MPG Range */}
                  <Col md={6} lg={3}>
                    <Form.Label>Min MPG</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="e.g., 20"
                      value={localFilters.minMpg}
                      onChange={(e) => handleFilterChange('minMpg', e.target.value)}
                    />
                  </Col>

                  <Col md={6} lg={3}>
                    <Form.Label>Max MPG</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="e.g., 40"
                      value={localFilters.maxMpg}
                      onChange={(e) => handleFilterChange('maxMpg', e.target.value)}
                    />
                  </Col>

                  {/* Year Range */}
                  <Col md={6} lg={3}>
                    <Form.Label>Min Year</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="e.g., 70"
                      value={localFilters.minYear}
                      onChange={(e) => handleFilterChange('minYear', e.target.value)}
                    />
                  </Col>

                  <Col md={6} lg={3}>
                    <Form.Label>Max Year</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="e.g., 82"
                      value={localFilters.maxYear}
                      onChange={(e) => handleFilterChange('maxYear', e.target.value)}
                    />
                  </Col>

                  {/* Clear Filters */}
                  <Col md={6} lg={2}>
                    <Form.Label>&nbsp;</Form.Label>
                    <div>
                      <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
                        Clear Filters
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </FilterCard>
          </Col>
        </Row>
      )}

      {/* Sort Options */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <span className="text-muted small">Sort by:</span>
            {[
              { key: 'mpg', label: 'MPG' },
              { key: 'carName', label: 'Name' },
              { key: 'modelYear', label: 'Year' },
              { key: 'cylinders', label: 'Cylinders' },
              { key: 'horsepower', label: 'Horsepower' },
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={filters.sortBy === key ? 'primary' : 'outline-secondary'}
                size="sm"
                onClick={() => handleSortChange(key)}
              >
                {label}
                {filters.sortBy === key && (
                  <span className="ms-1">
                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </Col>
      </Row>

      {/* Vehicle Display */}
      <Row>
        <Col>
          {viewMode === 'table' ? (
            <ReactTable>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{minWidth: '300px'}}>Vehicle</th>
                      <th style={{minWidth: '80px'}}>MPG</th>
                      <th style={{minWidth: '100px'}}>Cylinders</th>
                      <th style={{minWidth: '110px'}}>Horsepower</th>
                      <th style={{minWidth: '100px'}}>Weight</th>
                      <th style={{minWidth: '100px'}}>Origin</th>
                      <th style={{minWidth: '80px'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.slice(0, 10).map(vehicle => (
                      <tr key={vehicle.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                              <Car size={16} className="text-primary" />
                            </div>
                            <div>
                              <Link
                                to={`/vehicle/${vehicle.id}`}
                                className="text-decoration-none fw-semibold"
                              >
                                {vehicle.carName}
                              </Link>
                              <div className="text-muted small">
                                {vehicle.modelYear + 1900} • {vehicle.originName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge bg="success" className="fs-6">{vehicle.mpg}</Badge>
                        </td>
                        <td>{vehicle.cylinders}</td>
                        <td>{vehicle.horsepower || 'N/A'}</td>
                        <td>{vehicle.weight} lbs</td>
                        <td>{vehicle.originName}</td>
                        <td>
                          <Button
                            variant="link"
                            size="sm"
                            className="p-1"
                            onClick={() => toggleFavorite(vehicle)}
                          >
                            <Heart
                              size={16}
                              className={isFavorite(vehicle.id) ? 'text-danger' : 'text-muted'}
                              fill={isFavorite(vehicle.id) ? 'currentColor' : 'none'}
                            />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Simple Pagination */}
              <div className="d-flex align-items-center justify-content-between p-3 bg-light">
                <div className="text-muted small">
                  Showing 1 to {Math.min(10, vehicles.length)} of {vehicles.length} entries
                </div>
                <div className="d-flex gap-1">
                  <Button variant="outline-primary" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline-primary" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </ReactTable>
          ) : (
            <>
              {/* Grid/List View */}
              <Row>
                {vehicles.map((vehicle) => 
                  viewMode === 'grid' ? (
                    <VehicleGridCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      isFavorite={isFavorite(vehicle.id)}
                      onToggleFavorite={() => toggleFavorite(vehicle)}
                    />
                  ) : (
                    <Col key={vehicle.id} xs={12}>
                      <VehicleListCard
                        vehicle={vehicle}
                        isFavorite={isFavorite(vehicle.id)}
                        onToggleFavorite={() => toggleFavorite(vehicle)}
                      />
                    </Col>
                  )
                )}
              </Row>

              {/* Grid/List Pagination */}
              {totalPages > 1 && (
                <Row className="mt-4">
                  <Col>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <Button
                        variant="outline-primary"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        Previous
                      </Button>
                      
                      <div className="d-flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let page;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (pagination.page <= 3) {
                            page = i + 1;
                          } else if (pagination.page >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = pagination.page - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={page}
                              variant={page === pagination.page ? 'primary' : 'outline-secondary'}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline-primary"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </Col>
                </Row>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
});

Gallery.displayName = 'Gallery';

export default Gallery;