import React from 'react';
import { 
  Car, 
  BarChart3, 
  Heart, 
  Search, 
  Database, 
  Zap,
  Github,
  Mail,
  Globe,
  Calendar,
  Users,
  TrendingUp
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Database,
      title: 'Comprehensive Dataset',
      description: 'Automotive fuel economy data from 1970-1982 covering 398+ vehicles from multiple manufacturers worldwide.'
    },
    {
      icon: Search,
      title: 'Advanced Filtering',
      description: 'Search and filter vehicles by name, origin, cylinders, MPG range, year, and more with real-time results.'
    },
    {
      icon: BarChart3,
      title: 'Data Visualization',
      description: 'Interactive charts and graphs showing MPG trends, origin distribution, and performance analytics.'
    },
    {
      icon: Heart,
      title: 'Personal Favorites',
      description: 'Save your favorite vehicles locally and export your collection as CSV for further analysis.'
    },
    {
      icon: TrendingUp,
      title: 'Historical Insights',
      description: 'Understand automotive evolution during the oil crisis era and early fuel efficiency regulations.'
    },
    {
      icon: Zap,
      title: 'Performance Analysis',
      description: 'Compare horsepower, weight, acceleration, and fuel economy across different vehicle categories.'
    }
  ];

  const techStack = [
    { name: 'React 19', category: 'Frontend', color: 'bg-blue-100 text-blue-800' },
    { name: 'Node.js', category: 'Backend', color: 'bg-green-100 text-green-800' },
    { name: 'Express', category: 'API', color: 'bg-gray-100 text-gray-800' },
    { name: 'Zustand', category: 'State Management', color: 'bg-purple-100 text-purple-800' },
    { name: 'Tailwind CSS', category: 'Styling', color: 'bg-cyan-100 text-cyan-800' },
    { name: 'Chart.js', category: 'Visualization', color: 'bg-orange-100 text-orange-800' },
    { name: 'React Router', category: 'Navigation', color: 'bg-red-100 text-red-800' },
    { name: 'Lucide React', category: 'Icons', color: 'bg-indigo-100 text-indigo-800' }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <Car className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Auto Explorer</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          A comprehensive React-based data visualization platform for exploring automotive fuel economy 
          data from the pivotal 1970-1982 period in automotive history.
        </p>
      </div>

      {/* Mission Statement */}
      <div className="card">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Auto Explorer was created to make historical automotive data accessible and engaging. 
            By providing interactive visualizations and comprehensive filtering tools, we help users 
            understand the evolution of fuel efficiency during a transformative period in automotive history.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data-Driven</h3>
            <p className="text-sm text-gray-600">
              Built on authentic automotive data from the UC Irvine Machine Learning Repository
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">User-Focused</h3>
            <p className="text-sm text-gray-600">
              Designed with intuitive navigation and responsive design for all devices
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Insightful</h3>
            <p className="text-sm text-gray-600">
              Revealing trends and patterns in automotive efficiency evolution
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title} 
                className="card group hover:shadow-lg transition-shadow duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {techStack.map((tech) => (
            <div key={tech.name} className="text-center">
              <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${tech.color}`}>
                {tech.name}
              </div>
              <p className="text-xs text-gray-500 mt-1">{tech.category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dataset Information */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dataset Information</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Source</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span><strong>Time Period:</strong> 1970-1982 model years</span>
              </div>
              <div className="flex items-center space-x-3">
                <Database className="h-4 w-4 text-gray-400" />
                <span><strong>Total Records:</strong> 398 vehicles</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4 text-gray-400" />
                <span><strong>Origins:</strong> USA, Europe, Japan</span>
              </div>
              <div className="flex items-center space-x-3">
                <Car className="h-4 w-4 text-gray-400" />
                <span><strong>Manufacturers:</strong> 30+ brands</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Attributes</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Miles per Gallon (MPG)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Engine Cylinders</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Engine Displacement</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Horsepower</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Vehicle Weight</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span>Acceleration</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Context */}
      <div className="card bg-gradient-to-r from-amber-50 to-orange-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Historical Context</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-amber-800 mb-3">The Oil Crisis Era</h3>
            <p className="text-amber-700 text-sm leading-relaxed mb-4">
              The 1970s marked a pivotal period in automotive history. The oil crises of 1973 and 1979 
              fundamentally changed consumer preferences and regulatory approaches to fuel efficiency.
            </p>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• 1973: First oil embargo drives fuel prices up 400%</li>
              <li>• 1975: CAFE standards introduced in the US</li>
              <li>• 1979: Second oil crisis reinforces efficiency focus</li>
              <li>• 1980s: Smaller, more efficient engines become mainstream</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-amber-800 mb-3">Automotive Evolution</h3>
            <p className="text-amber-700 text-sm leading-relaxed mb-4">
              This dataset captures the automotive industry's transformation from powerful, 
              fuel-hungry vehicles to more efficient, environmentally conscious designs.
            </p>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Shift from V8 to smaller 4 & 6 cylinder engines</li>
              <li>• Rise of Japanese manufacturers in efficiency</li>
              <li>• Introduction of front-wheel drive layouts</li>
              <li>• Early adoption of turbocharging technology</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact/Links */}
      <div className="card text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Involved</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Auto Explorer is an open-source project. We welcome contributions, feedback, and suggestions 
          for improving the platform and expanding the dataset.
        </p>
        
        <div className="flex justify-center space-x-6">
          <a
            href="https://github.com"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-5 w-5" />
            <span>GitHub Repository</span>
          </a>
          
          <a
            href="mailto:contact@autoexplorer.com"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Mail className="h-5 w-5" />
            <span>Contact Us</span>
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-gray-200">
        <p className="text-gray-500 text-sm">
          Built with ❤️ for automotive enthusiasts and data lovers everywhere.
        </p>
        <p className="text-gray-400 text-xs mt-2">
          Dataset originally from the UCI Machine Learning Repository
        </p>
      </div>
    </div>
  );
};

export default About;