// Configuration for API URLs
const config = {
  // Development environment
  development: {
    API_URL: 'http://localhost:5000'
  },
  // Production environment (Railway)
  production: {
    API_URL: process.env.REACT_APP_API_URL || 'https://your-backend-domain.railway.app'
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate configuration
export const API_URL = config[environment].API_URL;

export default config[environment]; 