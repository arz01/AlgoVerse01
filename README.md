# AlgoVerse - Competitive Programming Analytics Platform

A comprehensive web application for analyzing competitive programming performance using Codeforces data. Built with React frontend and Node.js backend.

## Features

- **User Authentication**: Secure login/register system with JWT tokens
- **Codeforces Integration**: Fetch and analyze user's competitive programming data
- **Topic-wise Analytics**: Detailed analysis across 6 major topics:
  - Implementation
  - Dynamic Programming
  - Data Structures
  - Algorithms
  - Mathematics
  - Graph Theory
- **Visual Analytics**: Interactive charts and progress indicators
- **Performance Comparison**: Compare your stats with other users
- **AI Chat Assistant**: Get help with competitive programming using Gemini AI
- **Leaderboard**: See how you rank among other users
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

### Frontend
- React 19
- React Router DOM
- CSS3 with modern animations
- Responsive design

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Google Gemini AI API
- Codeforces API integration

## Quick Start

### Prerequisites
- Node.js (>=16.0.0)
- MongoDB Atlas account
- Google Gemini API key
- Codeforces account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd AlgoVerse
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` file in the server directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=development
   ```

4. **Run the application**
   ```bash
   # Start backend (from server directory)
   npm start
   
   # Start frontend (from client directory)
   npm start
   ```

## Deployment

### Railway Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Railway**
   - Connect your GitHub repository to Railway
   - Set environment variables in Railway dashboard
   - Deploy both frontend and backend services

### Environment Variables for Production

Set these in Railway:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Your JWT secret key
- `GEMINI_API_KEY`: Your Google Gemini API key
- `NODE_ENV`: production
- `REACT_APP_API_URL`: Your backend Railway URL

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/codeforces-handle` - Update Codeforces handle

### Codeforces Data
- `GET /api/codeforces/:handle/summary` - Get user's topic summary
- `GET /api/codeforces/:handle/info` - Get user info
- `GET /api/codeforces/:handle/debug` - Debug endpoint

### AI Chat
- `POST /api/gemini/chat` - Chat with Gemini AI

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard data

## Project Structure

```
AlgoVerse/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── styles/        # CSS files
│   │   └── config.js      # API configuration
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── package.json
├── railway.json         # Railway configuration
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@algoverse.com or create an issue in the repository. 