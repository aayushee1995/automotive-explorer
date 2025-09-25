import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Car, 
  Fuel, 
  Calendar, 
  Gauge, 
  Weight, 
  Zap,
  Globe,
  Share2,
  BarChart3
} from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import clsx from 'clsx';

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchVehicle, toggleFavorite, isFavorite, vehicles } = useVehicleStore();
  
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [similarVehicles, setSimilarVehicles] = useState([]);

  useEffect(() => {
    const loadVehicle = async () => {
      setLoading(true);
      try {
        const vehicleData = await fetchVehicle(parseInt(id));
        setVehicle(vehicleData);
        
        // Find similar vehicles based on origin and cylinders
        if (vehicleData && vehicles.length > 0) {
          const similar = vehicles
            .filter(v => 
              v.id !== vehicleData.id && 
              (v.origin === vehicleData.origin || v.cylinders === vehicleData.cylinders)
            )
            .slice(0, 4);
          setSimilarVehicles(similar);
        }
      } catch (error) {
        console.error('Error loading vehicle:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadVehicle();
    }
  }, [id, fetchVehicle, vehicles]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleShare = async () => {
    if (navigator.share && vehicle) {
      try {
        await navigator.share({
          title: `${vehicle.carName} - Auto Explorer`,
          text: `Check out this ${vehicle.carName} with ${vehicle.mpg} MPG!`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Vehicle not found</h2>
        <p className="text-gray-600 mb-6">The vehicle you're looking for doesn't exist.</p>
        <Link to="/gallery" className="btn btn-primary">
          Back to Gallery
        </Link>
      </div>
    );
  }

  const specs = [
    { 
      icon: Fuel, 
      label: 'Fuel Economy', 
      value: `${vehicle.mpg} MPG`, 
      color: 'text-green-600',
      bgColor: 'bg-green-100' 
    },
    { 
      icon: Zap, 
      label: 'Horsepower', 
      value: vehicle.horsepower ? `${vehicle.horsepower} HP` : 'N/A', 
      color: 'text-red-600',
      bgColor: 'bg-red-100' 
    },
    { 
      icon: Gauge, 
      label: 'Cylinders', 
      value: vehicle.cylinders, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100' 
    },
    { 
      icon: Weight, 
      label: 'Weight', 
      value: `${vehicle.weight} lbs`, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100' 
    },
    { 
      icon: Calendar, 
      label: 'Model Year', 
      value: vehicle.modelYear + 1900, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100' 
    },
    { 
      icon: Globe, 
      label: 'Origin', 
      value: vehicle.originName, 
      color: 'text-teal-600',
      bgColor: 'bg-teal-100' 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="btn btn-outline flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
          
          <button
            onClick={() => toggleFavorite(vehicle)}
            className={clsx(
              'btn flex items-center space-x-2',
              isFavorite(vehicle.id) 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'btn-outline'
            )}
          >
            <Heart className={clsx('h-4 w-4', isFavorite(vehicle.id) && 'fill-current')} />
            <span>{isFavorite(vehicle.id) ? 'Favorited' : 'Add to Favorites'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Vehicle Info */}
        <div className="space-y-6">
          {/* Interactive Car Visual */}
          <div
            className="relative card overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div 
              className="absolute inset-0 transition-all duration-300 ease-out"
              style={{
                background: isHovering 
                  ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`
                  : 'transparent'
              }}
            />
            
            <div className="relative z-10 flex flex-col items-center py-12">
              <div 
                className="relative transform transition-transform duration-300 ease-out"
                style={{
                  transform: isHovering 
                    ? `translate(${(mousePosition.x - 50) * 0.1}px, ${(mousePosition.y - 50) * 0.1}px) scale(1.05)` 
                    : 'scale(1)'
                }}
              >
                <div className="w-32 h-32 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-2xl">
                  <Car className="h-16 w-16 text-white" />
                </div>
                
                {/* Floating MPG Badge */}
                <div 
                  className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-sm shadow-lg transform transition-transform duration-300"
                  style={{
                    transform: isHovering ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
                  }}
                >
                  {vehicle.mpg} MPG
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mt-6 text-center">
                {vehicle.carName}
              </h1>
              
              <p className="text-gray-600 text-center mt-2">
                {vehicle.modelYear + 1900} • {vehicle.originName}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                <div className="text-green-800 font-semibold">Fuel Efficiency</div>
                <div className="text-2xl font-bold text-green-600">{vehicle.mpg} MPG</div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="text-blue-800 font-semibold">Acceleration</div>
                <div className="text-2xl font-bold text-blue-600">{vehicle.acceleration}s</div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                <div className="text-purple-800 font-semibold">Displacement</div>
                <div className="text-2xl font-bold text-purple-600">{vehicle.displacement}</div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
                <div className="text-red-800 font-semibold">Power</div>
                <div className="text-2xl font-bold text-red-600">
                  {vehicle.horsepower || 'N/A'} {vehicle.horsepower && 'HP'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Specifications */}
        <div className="space-y-6">
          {/* Detailed Specs */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Technical Specifications</h3>
            <div className="space-y-4">
              {specs.map((spec, index) => {
                const Icon = spec.icon;
                return (
                  <div 
                    key={spec.label} 
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={clsx('p-2 rounded-lg', spec.bgColor)}>
                      <Icon className={clsx('h-5 w-5', spec.color)} />
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium text-gray-900">{spec.label}</div>
                      <div className="text-sm text-gray-600">{spec.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Efficiency Rating */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Efficiency Rating</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">MPG Rating</span>
                <span className="text-sm text-gray-600">{vehicle.mpg}/50</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(vehicle.mpg / 50) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                {vehicle.mpg >= 30 ? 'Excellent' : vehicle.mpg >= 20 ? 'Good' : 'Fair'} fuel economy
              </div>
            </div>
          </div>

          {/* Era Context */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Historical Context</h3>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-5 w-5 text-amber-600" />
                <span className="font-semibold text-amber-800">
                  {vehicle.modelYear + 1900}s Era
                </span>
              </div>
              <p className="text-sm text-amber-700 leading-relaxed">
                {vehicle.modelYear + 1900 < 1975 
                  ? "From the era before fuel economy regulations, focusing on power and performance."
                  : "Built during the oil crisis period, with increased focus on fuel efficiency."
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Vehicles */}
      {similarVehicles.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Similar Vehicles</h3>
            <Link 
              to="/gallery" 
              className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
            >
              <span>View more</span>
              <BarChart3 className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarVehicles.map((similarVehicle) => (
              <Link
                key={similarVehicle.id}
                to={`/vehicle/${similarVehicle.id}`}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                    <Car className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className="text-sm font-bold text-primary-600">
                    {similarVehicle.mpg} MPG
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 text-sm">
                  {similarVehicle.carName}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {similarVehicle.modelYear + 1900} • {similarVehicle.originName}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetail;