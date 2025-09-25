import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useVehicleStore } from '../store/vehicleStore';
import { TrendingUp, BarChart3, PieChart, Calendar, Globe, Zap } from 'lucide-react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { vehicles, stats, loading, fetchVehicles, fetchStats } = useVehicleStore();
  const [selectedChart, setSelectedChart] = useState('mpg-trend');
  
  useEffect(() => {
    fetchVehicles({ limit: 1000 }); // Get all vehicles for analytics
    fetchStats();
  }, [fetchVehicles, fetchStats]);

  if (loading) {
    return (
      <Container>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading analytics...</span>
          </div>
        </div>
      </Container>
    );
  }

  // Prepare data for MPG trend over years
  const mpgTrendData = () => {
    const yearlyData = vehicles.reduce((acc, vehicle) => {
      const year = vehicle.modelYear + 1900;
      if (!acc[year]) {
        acc[year] = { total: 0, count: 0 };
      }
      acc[year].total += vehicle.mpg;
      acc[year].count++;
      return acc;
    }, {});

    const years = Object.keys(yearlyData).sort();
    const avgMpg = years.map(year => yearlyData[year].total / yearlyData[year].count);

    return {
      labels: years,
      datasets: [
        {
          label: 'Average MPG',
          data: avgMpg,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          fill: true,
        },
      ],
    };
  };

  // Prepare data for origin distribution
  const originDistributionData = () => {
    return {
      labels: Object.keys(stats?.originDistribution || {}),
      datasets: [
        {
          data: Object.values(stats?.originDistribution || {}),
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',   // Red for USA
            'rgba(59, 130, 246, 0.8)',  // Blue for Europe  
            'rgba(34, 197, 94, 0.8)',   // Green for Japan
          ],
          borderColor: [
            'rgb(239, 68, 68)',
            'rgb(59, 130, 246)', 
            'rgb(34, 197, 94)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  // Prepare data for cylinder distribution
  const cylinderDistributionData = () => {
    const cylinders = Object.keys(stats?.cylinderDistribution || {}).sort();
    return {
      labels: cylinders.map(c => `${c} cyl`),
      datasets: [
        {
          label: 'Number of Vehicles',
          data: cylinders.map(c => stats.cylinderDistribution[c]),
          backgroundColor: [
            'rgba(168, 85, 247, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderColor: [
            'rgb(168, 85, 247)',
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  // Prepare data for MPG vs Horsepower scatter
  const mpgHorsepowerData = () => {
    const validData = vehicles.filter(v => v.horsepower && v.horsepower > 0);
    
    return {
      labels: validData.map(v => v.carName),
      datasets: [
        {
          label: 'MPG vs Horsepower',
          data: validData.map(v => ({ x: v.horsepower, y: v.mpg })),
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgb(59, 130, 246)',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
        },
      },
    },
  };

  const scatterOptions = {
    ...chartOptions,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Horsepower',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'MPG',
        },
      },
    },
  };

  const charts = [
    {
      id: 'mpg-trend',
      title: 'MPG Trend Over Years',
      icon: TrendingUp,
      description: 'Average fuel economy progression from 1970-1982'
    },
    {
      id: 'origin-distribution',
      title: 'Vehicles by Origin',
      icon: Globe,
      description: 'Distribution of vehicles by manufacturing origin'
    },
    {
      id: 'cylinder-distribution',
      title: 'Engine Cylinder Distribution',
      icon: BarChart3,
      description: 'Number of vehicles by engine cylinder count'
    },
    {
      id: 'mpg-horsepower',
      title: 'MPG vs Horsepower',
      icon: Zap,
      description: 'Relationship between fuel economy and engine power'
    }
  ];

  const renderChart = () => {
    switch (selectedChart) {
      case 'mpg-trend':
        return (
          <div className="h-96">
            <Line data={mpgTrendData()} options={chartOptions} />
          </div>
        );
      case 'origin-distribution':
        return (
          <div className="h-96">
            <Doughnut 
              data={originDistributionData()} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    position: 'right',
                  },
                },
                scales: undefined,
              }} 
            />
          </div>
        );
      case 'cylinder-distribution':
        return (
          <div className="h-96">
            <Bar data={cylinderDistributionData()} options={chartOptions} />
          </div>
        );
      case 'mpg-horsepower':
        return (
          <div className="h-96">
            <Line 
              data={mpgHorsepowerData()} 
              options={{
                ...scatterOptions,
                elements: {
                  line: {
                    tension: 0,
                  },
                },
                showLine: false,
              }} 
            />
          </div>
        );
      default:
        return null;
    }
  };

  const selectedChartInfo = charts.find(chart => chart.id === selectedChart);

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-5">
        <Col>
          <h1 className="h2 fw-bold text-dark mb-3">Analytics Dashboard</h1>
          <p className="text-muted lead">
            Visualize and analyze automotive fuel economy data trends and patterns
          </p>
        </Col>
      </Row>

      {/* Key Metrics */}
      <Row className="mb-5">
        <Col xs={12} md={6} lg={3} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted small mb-1">Total Vehicles</p>
                <p className="h4 fw-bold text-dark mb-0">
                  {stats?.totalVehicles || 0}
                </p>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded">
                <BarChart3 size={24} className="text-primary" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted small mb-1">Average MPG</p>
                <p className="h4 fw-bold text-dark mb-0">
                  {stats?.avgMpg ? stats.avgMpg.toFixed(1) : '0'}
                </p>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded">
                <TrendingUp size={24} className="text-success" />
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
                  {stats?.mpgRange?.max || 0}
                </p>
              </div>
              <div className="bg-warning bg-opacity-10 p-3 rounded">
                <Zap size={24} className="text-warning" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted small mb-1">Year Range</p>
                <p className="h4 fw-bold text-dark mb-0">
                  {stats?.yearRange ? `${stats.yearRange.max - stats.yearRange.min + 1}` : '0'}
                </p>
              </div>
              <div className="bg-info bg-opacity-10 p-3 rounded">
                <Calendar size={24} className="text-info" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Chart Selection */}
      <Row className="mb-5">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h3 className="h5 fw-bold text-dark mb-4">Chart Selection</h3>
              <Row>
                {charts.map((chart) => {
                  const Icon = chart.icon;
                  return (
                    <Col md={6} lg={3} key={chart.id} className="mb-3">
                      <Button
                        variant={selectedChart === chart.id ? "primary" : "outline-secondary"}
                        className="w-100 h-100 p-3 text-start border-2"
                        onClick={() => setSelectedChart(chart.id)}
                      >
                        <div className="d-flex align-items-center mb-2">
                          <Icon size={20} className="me-2" />
                          <span className="fw-semibold">{chart.title}</span>
                        </div>
                        <p className="small mb-0 text-muted">
                          {chart.description}
                        </p>
                      </Button>
                    </Col>
                  );
                })}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Chart */}
      <Row className="mb-5">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h3 className="h5 fw-bold text-dark mb-1">
                    {selectedChartInfo?.title}
                  </h3>
                  <p className="text-muted small mb-0">
                    {selectedChartInfo?.description}
                  </p>
                </div>
              </div>

              {renderChart()}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Insights */}
      <Row className="mb-5">
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h3 className="h5 fw-bold text-dark mb-4">Key Insights</h3>
              <div className="mb-3">
                <div className="d-flex align-items-start mb-3">
                  <div className="bg-success rounded-circle me-3 mt-1" style={{width: '8px', height: '8px'}}></div>
                  <div>
                    <p className="fw-semibold text-dark mb-1">Fuel Economy Improvement</p>
                    <p className="text-muted small mb-0">
                      Average MPG increased significantly during the late 1970s due to oil crisis regulations.
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-start mb-3">
                  <div className="bg-primary rounded-circle me-3 mt-1" style={{width: '8px', height: '8px'}}></div>
                  <div>
                    <p className="fw-semibold text-dark mb-1">Origin Diversity</p>
                    <p className="text-muted small mb-0">
                      Japanese manufacturers led in fuel efficiency innovation during this period.
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <div className="bg-info rounded-circle me-3 mt-1" style={{width: '8px', height: '8px'}}></div>
                  <div>
                    <p className="fw-semibold text-dark mb-1">Engine Downsizing</p>
                    <p className="text-muted small mb-0">
                      Shift from large V8 engines to smaller 4 and 6 cylinder engines for better efficiency.
                    </p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h3 className="h5 fw-bold text-dark mb-4">Top Performers</h3>
              <div>
                {vehicles
                  .sort((a, b) => b.mpg - a.mpg)
                  .slice(0, 5)
                  .map((vehicle, index) => (
                    <div key={vehicle.id} className="d-flex align-items-center justify-content-between p-3 bg-light rounded mb-2">
                      <div className="d-flex align-items-center">
                        <div className={`d-flex align-items-center justify-content-center text-white fw-bold me-3 rounded-circle ${
                          index === 0 ? 'bg-warning' :
                          index === 1 ? 'bg-secondary' :
                          index === 2 ? 'bg-warning' : 'bg-secondary'
                        }`} style={{width: '24px', height: '24px', fontSize: '12px'}}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="fw-semibold text-dark mb-0 small">{vehicle.carName}</p>
                          <p className="text-muted mb-0" style={{fontSize: '11px'}}>{vehicle.modelYear + 1900} • {vehicle.originName}</p>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold text-success">{vehicle.mpg}</div>
                        <div className="text-muted" style={{fontSize: '10px'}}>MPG</div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;