import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/TopicDetails.css";

function TopicDetails() {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [topicData, setTopicData] = useState(null);
  const [userHandle, setUserHandle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    if (userHandle) {
      fetchTopicData();
    }
  }, [userHandle, topic]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/auth/profile", {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user.codeforcesHandle) {
          setUserHandle(data.user.codeforcesHandle);
        } else {
          setError("Please set your Codeforces handle first");
          setLoading(false);
        }
      } else if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to fetch user profile");
        setLoading(false);
      }
    } catch (error) {
      setError("Failed to fetch user profile");
      setLoading(false);
    }
  };

  const fetchTopicData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/codeforces/${userHandle}/summary`);
      
      if (response.ok) {
        const data = await response.json();
        setTopicData(data[topic] || { solved: 0, maxRating: 0, problems: [] });
      } else {
        const errorData = await response.json();
        setError(errorData.msg || "Failed to fetch topic data");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = (problems) => {
    if (!problems || problems.length === 0) return 0;
    const totalRating = problems.reduce((sum, problem) => sum + (problem.rating || 0), 0);
    return Math.round(totalRating / problems.length);
  };

  const getNextRecommendedRating = (problems) => {
    if (!problems || problems.length === 0) return 800;
    
    const ratings = problems.map(p => p.rating || 0).filter(r => r > 0);
    if (ratings.length === 0) return 800;
    
    const maxRating = Math.max(...ratings);
    const avgRating = Math.round(ratings.reduce((sum, r) => sum + r, 0) / ratings.length);
    
    // Recommend next rating based on current performance
    if (maxRating < 1000) return Math.min(maxRating + 200, 1000);
    if (maxRating < 1500) return Math.min(maxRating + 150, 1500);
    if (maxRating < 2000) return Math.min(maxRating + 100, 2000);
    return Math.min(maxRating + 50, 2500);
  };

  const getTopicTitle = (topic) => {
    const titles = {
      implementation: "Implementation",
      dp: "Dynamic Programming",
      datastructures: "Data Structures",
      algorithms: "Algorithms",
      math: "Mathematics",
      graphtheory: "Graph Theory"
    };
    return titles[topic] || topic.charAt(0).toUpperCase() + topic.slice(1);
  };

  const getTopicDescription = (topic) => {
    const descriptions = {
      implementation: "Master the art of translating algorithms into code. Focus on clean, efficient implementations and handling edge cases.",
      dp: "Learn to solve complex problems by breaking them into simpler subproblems. Master memoization, tabulation, and various DP techniques.",
      datastructures: "Explore fundamental and advanced data structures including arrays, linked lists, stacks, queues, trees, and graphs.",
      algorithms: "Master essential algorithms including sorting, searching, binary search, two pointers, and greedy algorithms.",
      math: "Dive into mathematical concepts including number theory, combinatorics, probability, and modular arithmetic.",
      graphtheory: "Explore graph algorithms including DFS, BFS, shortest paths, and advanced graph techniques."
    };
    return descriptions[topic] || "Explore this topic and improve your problem-solving skills.";
  };

  if (loading) {
    return (
      <div className="topic-details-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading topic data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="topic-details-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => navigate("/dashboard")} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const avgRating = calculateAverageRating(topicData.problems);
  const nextRating = getNextRecommendedRating(topicData.problems);

  return (
    <div className="topic-details-container">
      <div className="topic-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>{getTopicTitle(topic)}</h1>
        <p className="topic-description">{getTopicDescription(topic)}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Problems Solved</h3>
            <div className="stat-value">{topicData.solved}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3>Max Rating Solved</h3>
            <div className="stat-value">{topicData.maxRating || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Average Rating</h3>
            <div className="stat-value">{avgRating}</div>
          </div>
        </div>

        <div className="stat-card recommendation">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Next Target</h3>
            <div className="stat-value">{nextRating}</div>
            <p className="recommendation-text">
              Try solving a {nextRating} rated problem next!
            </p>
          </div>
        </div>
      </div>

      <div className="problems-section">
        <h2>Solved Problems</h2>
        {topicData.problems && topicData.problems.length > 0 ? (
          <div className="problems-grid">
            {topicData.problems
              .sort((a, b) => (b.rating || 0) - (a.rating || 0))
              .map((problem, index) => (
                <div key={index} className="problem-card">
                  <div className="problem-header">
                    <h4>{problem.name}</h4>
                    <span className={`rating-badge rating-${Math.floor((problem.rating || 0) / 100) * 100}`}>
                      {problem.rating || "Unrated"}
                    </span>
                  </div>
                  <div className="problem-tags">
                    {problem.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span key={tagIndex} className="tag">
                        {tag}
                      </span>
                    ))}
                    {problem.tags.length > 3 && (
                      <span className="tag more">+{problem.tags.length - 3}</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="no-problems">
            <p>No problems solved in this topic yet.</p>
            <p>Start with some basic problems to build your foundation!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopicDetails; 