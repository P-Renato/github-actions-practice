import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import type { ApiResponse, User } from './types/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req: Request, res: Response<ApiResponse>) => {
  const response: ApiResponse = {
    success: true,
    message: 'Welcome to MERN CI/CD Practice API with TypeScript and Bun!'
  };
  res.json(response);
});

app.get('/api/health', (req: Request, res: Response<ApiResponse>) => {
  const response: ApiResponse = {
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      runtime: 'Bun',
      typescript: true,
      version: process.version
    }
  };
  res.json(response);
});

app.post('/api/users', (
  req: Request<{}, {}, Omit<User, 'id' | 'createdAt'>>, 
  res: Response<ApiResponse<User>>
) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    const response: ApiResponse = {
      success: false,
      error: 'Name and email are required'
    };
    return res.status(400).json(response);
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const response: ApiResponse = {
      success: false,
      error: 'Invalid email format'
    };
    return res.status(400).json(response);
  }

  const newUser: User = {
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString()
  };

  const response: ApiResponse<User> = {
    success: true,
    data: newUser
  };
  
  res.status(201).json(response);
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  console.error('Error:', err.stack);
  
  const response: ApiResponse = {
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  };
  
  res.status(500).json(response);
});

// 404 handler
app.use((req: Request, res: Response<ApiResponse>) => {
  const response: ApiResponse = {
    success: false,
    error: 'Route not found'
  };
  res.status(404).json(response);
});

// Start server
if (import.meta.main) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⚡ Runtime: Bun with TypeScript`);
    console.log(`🌐 http://localhost:${PORT}`);
  });
}

export default app;