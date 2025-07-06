import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Leaderboard.css";

function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchLeaderboardData();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:5000/api/auth/profile", {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  };

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Please login to view leaderboard");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/leaderboard", {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLeaderboardData(data.leaderboard);
      } else {
        const errorData = await response.json();
        setError(errorData.msg || "Failed to fetch leaderboard data");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRatingColor = (rating) => {
    if (rating >= 2400) return "rating-red";
    if (rating >= 2100) return "rating-orange";
    if (rating >= 1900) return "rating-violet";
    if (rating >= 1600) return "rating-blue";
    if (rating >= 1400) return "rating-cyan";
    if (rating >= 1200) return "rating-green";
    return "rating-gray";
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={fetchLeaderboardData} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>🏆 Leaderboard</h1>
        <p>Rankings based on Codeforces performance and problem-solving skills</p>
      </div>

      <div className="scoring-info">
        <h3>📊 Scoring System</h3>
        <div className="scoring-details">
          <div className="scoring-item">
            <span className="scoring-label">Rating Points:</span>
            <span className="scoring-value">Current CF Rating × 0.5</span>
          </div>
          <div className="scoring-item">
            <span className="scoring-label">Problem Points:</span>
            <span className="scoring-value">Total Solved × 10</span>
          </div>
          <div className="scoring-item">
            <span className="scoring-label">Difficulty Bonus:</span>
            <span className="scoring-value">Hard Problems (1600+) × 5</span>
          </div>
          <div className="scoring-item">
            <span className="scoring-label">Total Score:</span>
            <span className="scoring-value">Rating + Problems + Bonus</span>
          </div>
        </div>
      </div>

      <div className="leaderboard-table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}></th>
              <th>Rank</th>
              <th>User</th>
              <th>Codeforces Handle</th>
              <th>Current Rating</th>
              <th>Problems Solved</th>
              <th>Hard Problems</th>
              <th>Total Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((user, index) => (
              <tr 
                key={user._id} 
                className={`${index < 3 ? "top-three" : ""} ${
                  currentUser && user._id === currentUser._id ? "current-user" : ""
                }`}
              >
                <td className="indicator-cell">
                  {currentUser && user._id === currentUser._id && (
                    <span className="you-indicator">👤 You</span>
                  )}
                </td>
                <td className="rank-cell">
                  <span className="rank-icon">{getRankIcon(index + 1)}</span>
                </td>
                <td className="user-cell">
                  <div className="user-info">
                    <span className="username">{user.username}</span>
                  </div>
                </td>
                <td className="handle-cell">
                  <a 
                    href={`https://codeforces.com/profile/${user.codeforcesHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`cf-handle ${getRatingColor(user.currentRating)}`}
                  >
                    {user.codeforcesHandle}
                  </a>
                </td>
                <td className="rating-cell">
                  <span className={`rating-badge ${getRatingColor(user.currentRating)}`}>
                    {user.currentRating}
                  </span>
                </td>
                <td className="problems-cell">
                  <span className="problems-count">{user.totalSolved}</span>
                </td>
                <td className="hard-problems-cell">
                  <span className="hard-problems-count">{user.hardProblems}</span>
                </td>
                <td className="score-cell">
                  <span className="total-score">{user.totalScore.toFixed(0)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {leaderboardData.length === 0 && (
        <div className="no-data">
          <p>No users found. Be the first to join the leaderboard!</p>
        </div>
      )}
    </div>
  );
}

export default Leaderboard; 