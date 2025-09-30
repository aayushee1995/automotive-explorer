# Automotive Explorer

A full-stack web application for exploring and analyzing automotive data from the Auto MPG dataset. Users can browse vehicles, view analytics, create accounts, and manage favorites.

## Features

- **Vehicle Gallery**: Browse and search through automotive data
- **Analytics Dashboard**: Visualize MPG trends, cylinder distributions, and origin statistics
- **User Authentication**: Register and login to access personalized features
- **Favorites System**: Save and manage favorite vehicles
- **Advanced Filtering**: Filter vehicles by MPG, cylinders, origin, and model year
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Zustand (state management)
- Tailwind CSS
- Bootstrap
- Chart.js
- Axios

### Backend
- Node.js
- Express.js
- JWT Authentication
- CSV Parser
- bcryptjs

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd automotive-explorer
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on http://localhost:5000

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on http://localhost:5173

3. Open your browser and navigate to http://localhost:5173

## Mobile Testing

To test the application on mobile devices:

1. Find your computer's local IP address:
   - **Windows**: Open Command Prompt and run `ipconfig`
   - **Mac/Linux**: Open Terminal and run `ifconfig` or `ip addr`

2. Update the API URL in `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://YOUR_IP_ADDRESS:5000
   ```
   Replace `YOUR_IP_ADDRESS` with your computer's IP address (e.g., `192.168.1.100`)

3. Restart the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

4. On your mobile device, connect to the same Wi-Fi network as your computer and navigate to:
   ```
   http://YOUR_IP_ADDRESS:5173
   ```

**Note**: Make sure your firewall allows connections on ports 5000 and 5173, and that both devices are on the same network.

## API Endpoints

The backend provides the following endpoints:

- `GET /` - API information
- `GET /cars` - Get all vehicles with filtering and pagination
- `GET /cars/:id` - Get specific vehicle by ID
- `GET /cars/stats` - Get data statistics
- `GET /cars/origins` - Get available origins
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info
- `PUT /auth/profile` - Update user profile

## Project Structure

```
automotive-explorer/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── data/
│       ├── auto-mpg.csv
│       └── users.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── ...
│   ├── package.json
│   └── ...
└── .gitignore
```

## Deployment

### Frontend Deployment
When deploying the frontend to production platforms (Vercel, Netlify, etc.), set the following environment variable:

```env
VITE_API_BASE_URL=https://automotive-explorer-api.onrender.com
```

**Platform-specific instructions:**

- **Vercel**: Add the environment variable in your project settings
- **Netlify**: Add the environment variable in site settings > environment variables
- **Other platforms**: Check their documentation for setting environment variables

### Backend Deployment
The backend is already deployed at: https://automotive-explorer-api.onrender.com

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
