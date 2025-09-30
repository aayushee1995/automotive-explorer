const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

let cars = [];
let users = [];

// Users JSON file path
const usersPath = path.join(__dirname, "data", "users.json");

// Load users from JSON file
const loadUsers = () => {
  try {
    if (fs.existsSync(usersPath)) {
      const userData = fs.readFileSync(usersPath, 'utf8');
      users = JSON.parse(userData);
      console.log(`Loaded ${users.length} users from JSON file.`);
    } else {
      console.log('Users file not found, starting with empty user list.');
      saveUsers(); // Create empty file
    }
  } catch (error) {
    console.error('Error loading users:', error);
    users = [];
  }
};

// Save users to JSON file
const saveUsers = () => {
  try {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

// Initialize users on startup
loadUsers();

// load CSV once at startup
const csvPath = path.join(__dirname, "data", "auto-mpg.csv");

// Load CSV data into memory when server starts
fs.createReadStream(csvPath)
  .pipe(csv())
  .on("data", (row) => {
    // Convert numeric fields to numbers and add ID
    const processedRow = {
      id: cars.length,
      mpg: parseFloat(row.mpg) || 0,
      cylinders: parseInt(row.cylinders) || 0,
      displacement: parseFloat(row.displacement) || 0,
      horsepower: row.horsepower === '?' ? null : parseInt(row.horsepower),
      weight: parseInt(row.weight) || 0,
      acceleration: parseFloat(row.acceleration) || 0,
      modelYear: parseInt(row["model year"]) || 0,
      origin: parseInt(row.origin) || 0,
      carName: row["car name"] || "",
      originName: getOriginName(parseInt(row.origin) || 0)
    };
    cars.push(processedRow);
  })
  .on("end", () => {
    console.log(`CSV file successfully processed. Loaded ${cars.length} vehicles.`);
  });

// Helper function to get origin name
function getOriginName(origin) {
  switch (origin) {
    case 1: return "USA";
    case 2: return "Europe";
    case 3: return "Japan";
    default: return "Unknown";
  }
}

// Middleware
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true
}));
app.use(express.json());

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Authentication Routes
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      id: users.length + 1,
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
      favoriteCount: 0,
      lastActivity: Date.now(),
    };

    users.push(newUser);
    saveUsers(); // Save to JSON file

    // Generate token
    const token = generateToken(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Update last activity
    user.lastActivity = Date.now();
    saveUsers(); // Save updated activity to JSON file

    // Generate token
    const token = generateToken(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/auth/me', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update last activity
    user.lastActivity = Date.now();
    saveUsers(); // Save updated activity to JSON file

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate input
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Check if new email is already taken by another user
    if (email.toLowerCase() !== user.email.toLowerCase()) {
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ error: 'Email already taken by another user' });
      }
    }

    // Update user
    user.name = name.trim();
    user.email = email.toLowerCase();
    user.lastActivity = Date.now();
    saveUsers(); // Save updated profile to JSON file

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Auto MPG API 🚗",
    endpoints: [
      "GET /cars - Get all cars with filtering, search, and sorting",
      "GET /cars/:id - Get specific car by ID",
      "GET /cars/stats - Get data statistics",
      "GET /cars/origins - Get available origins"
    ]
  });
});

// Get data statistics (MUST be before parameterized routes)
app.get("/cars/stats", (req, res) => {
  try {
    const stats = {
      totalVehicles: cars.length,
      avgMpg: cars.reduce((sum, car) => sum + car.mpg, 0) / cars.length,
      mpgRange: {
        min: Math.min(...cars.map(car => car.mpg)),
        max: Math.max(...cars.map(car => car.mpg))
      },
      yearRange: {
        min: Math.min(...cars.map(car => car.modelYear)),
        max: Math.max(...cars.map(car => car.modelYear))
      },
      cylinderDistribution: cars.reduce((acc, car) => {
        acc[car.cylinders] = (acc[car.cylinders] || 0) + 1;
        return acc;
      }, {}),
      originDistribution: cars.reduce((acc, car) => {
        const originName = car.originName;
        acc[originName] = (acc[originName] || 0) + 1;
        return acc;
      }, {})
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get available origins (MUST be before parameterized routes)
app.get("/cars/origins", (req, res) => {
  try {
    const origins = [
      { id: 1, name: "USA" },
      { id: 2, name: "Europe" },
      { id: 3, name: "Japan" }
    ];
    res.json(origins);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Main cars endpoint with advanced filtering, search, and sorting
app.get("/cars", (req, res) => {
  try {
    let filtered = [...cars];
    const {
      search,
      cylinders,
      origin,
      minMpg,
      maxMpg,
      minYear,
      maxYear,
      sortBy,
      sortOrder,
      page,
      limit
    } = req.query;

    // Search functionality
    if (search) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter(car =>
        car.carName.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by cylinders
    if (cylinders) {
      filtered = filtered.filter(car => car.cylinders === parseInt(cylinders));
    }

    // Filter by origin
    if (origin) {
      filtered = filtered.filter(car => car.origin === parseInt(origin));
    }

    // Filter by MPG range
    if (minMpg) {
      filtered = filtered.filter(car => car.mpg >= parseFloat(minMpg));
    }
    if (maxMpg) {
      filtered = filtered.filter(car => car.mpg <= parseFloat(maxMpg));
    }

    // Filter by year range
    if (minYear) {
      filtered = filtered.filter(car => car.modelYear >= parseInt(minYear));
    }
    if (maxYear) {
      filtered = filtered.filter(car => car.modelYear <= parseInt(maxYear));
    }

    // Sorting
    if (sortBy) {
      const order = sortOrder === 'desc' ? -1 : 1;
      filtered.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        
        if (typeof aVal === 'string') {
          return order * aVal.localeCompare(bVal);
        }
        return order * (aVal - bVal);
      });
    }

    // Pagination
    const totalCount = filtered.length;
    if (page && limit) {
      const startIndex = (parseInt(page) - 1) * parseInt(limit);
      filtered = filtered.slice(startIndex, startIndex + parseInt(limit));
    }

    res.json({
      data: filtered,
      total: totalCount,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || filtered.length
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get specific car by ID (MUST be after specific routes)
app.get("/cars/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const car = cars.find(c => c.id === id);
    
    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ error: "Car not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚗 Auto MPG API Server running on http://localhost:${PORT}`);
  console.log(`🚗 Server accessible on network at http://0.0.0.0:${PORT}`);
});
