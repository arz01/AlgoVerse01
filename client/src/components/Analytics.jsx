import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Analytics.css";

function Analytics() {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [compareLoading, setCompareLoading] = useState(false);
  const [error, setError] = useState(null);
  const [compareError, setCompareError] = useState(null);
  const [userHandle, setUserHandle] = useState(null);
  const [compareHandle, setCompareHandle] = useState("");
  const [showCompare, setShowCompare] = useState(false);

  const topics = [
    { key: "implementation", name: "Implementation", color: "#FF6B6B" },
    { key: "dp", name: "Dynamic Programming", color: "#4ECDC4" },
    { key: "datastructures", name: "Data Structures", color: "#45B7D1" },
    { key: "algorithms", name: "Algorithms", color: "#96CEB4" },
    { key: "math", name: "Mathematics", color: "#FFEAA7" },
    { key: "graphtheory", name: "Graph Theory", color: "#DDA0DD" }
  ];

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
      fetchAnalyticsData();
    }
  }, [userHandle]);

  const fetchUserProfile = useCallback(async () => {
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
  }, [navigate]);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:5000/api/codeforces/${userHandle}/summary`, {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Analytics data:", data);
        setAnalyticsData(data);
      } else {
        setError("Failed to fetch analytics data");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userHandle]);

  const fetchCompareData = useCallback(async () => {
    if (!compareHandle.trim()) return;
    
    try {
      setCompareLoading(true);
      setCompareError(null);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:5000/api/codeforces/${compareHandle.trim()}/summary`, {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCompareData(data);
        setShowCompare(true);
      } else {
        setCompareError("Failed to fetch comparison data. Check if the handle exists.");
      }
    } catch (error) {
      setCompareError("Network error. Please try again.");
    } finally {
      setCompareLoading(false);
    }
  }, [compareHandle]);

  const handleCompare = () => {
    if (compareHandle.trim()) {
      fetchCompareData();
    }
  };

  const clearCompare = () => {
    setCompareData(null);
    setCompareHandle("");
    setShowCompare(false);
    setCompareError(null);
  };

  // Calculate topic rating with stricter rules
  const calculateTopicRating = (topicData) => {
    if (!topicData || topicData.solved === 0) return 0;
    
    const maxPossibleRating = 2500; // Increased max rating
    const maxProblems = 200; // Increased max problems for full score
    const minProblemsForRating = 5; // Minimum problems needed to count rating
    
    // Stricter rating score (requires higher ratings)
    let ratingScore = 0;
    if (topicData.solved >= minProblemsForRating) {
      const normalizedRating = Math.max(0, (topicData.maxRating - 800) / (maxPossibleRating - 800));
      ratingScore = Math.pow(normalizedRating, 1.5) * 35; // 35% weight, exponential curve
    }
    
    // Stricter problem score (requires more problems)
    const problemScore = Math.pow(Math.min(topicData.solved / maxProblems, 1), 1.3) * 40; // 40% weight, exponential curve
    
    // Stricter average rating score
    let avgRatingScore = 0;
    if (topicData.solved >= minProblemsForRating) {
      const normalizedAvgRating = Math.max(0, (topicData.avgRating - 800) / (maxPossibleRating - 800));
      avgRatingScore = Math.pow(normalizedAvgRating, 1.2) * 25; // 25% weight, exponential curve
    }
    
    return Math.min(ratingScore + problemScore + avgRatingScore, 100);
  };

  // Helper function to get topic data with fallback
  const getTopicData = (topicKey, data = analyticsData) => {
    if (!data) {
      return { solved: 0, maxRating: 0, avgRating: 0 };
    }
    
    const topicData = data[topicKey] || { solved: 0, maxRating: 0, problems: [] };
    
    const avgRating = topicData.problems && topicData.problems.length > 0 
      ? topicData.problems.reduce((sum, problem) => sum + (problem.rating || 0), 0) / topicData.problems.length
      : 0;
    
    return {
      solved: topicData.solved || 0,
      maxRating: topicData.maxRating || 0,
      avgRating: avgRating
    };
  };

  // Calculate progress percentage for circular progress
  const getProgressPercentage = (topicData) => {
    return calculateTopicRating(topicData);
  };

  // Calculate radar chart values using the same data as circular progress
  const getRadarValue = (topicData) => {
    if (!topicData || topicData.solved === 0) return 0;
    
    // Use the same calculation as circular progress but scale to 0-850
    const progressPercentage = calculateTopicRating(topicData);
    return (progressPercentage / 100) * 850 + 150; // Add 150 bonus to make values appear more normally
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container">
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

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>📊 Analytics Dashboard</h1>
        <p>Comprehensive analysis of your competitive programming performance</p>
        
        {/* Compare Feature */}
        <div className="compare-section">
          <div className="compare-input">
            <input
              type="text"
              placeholder="Enter Codeforces handle to compare..."
              value={compareHandle}
              onChange={(e) => setCompareHandle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCompare()}
              className="compare-input-field"
            />
            <button 
              onClick={handleCompare} 
              disabled={compareLoading || !compareHandle.trim()}
              className="compare-btn"
            >
              {compareLoading ? "Loading..." : "Compare"}
            </button>
            {showCompare && (
              <button onClick={clearCompare} className="clear-compare-btn">
                Clear
              </button>
            )}
          </div>
          {compareError && (
            <p className="compare-error">{compareError}</p>
          )}
        </div>
      </div>

      <div className="analytics-content">
        {/* Circular Progress Section */}
        <div className="circular-progress-section">
          <h2>🎯 Topic Progress {showCompare && `- ${userHandle} vs ${compareHandle}`}</h2>
          <p>Circular progress indicators showing performance in each topic</p>
          
          <div className="progress-circles">
            {topics.map((topic) => {
              const topicData = getTopicData(topic.key);
              const progress = getProgressPercentage(topicData);
              const circumference = 2 * Math.PI * 45;
              const strokeDasharray = circumference;
              const strokeDashoffset = circumference - (progress / 100) * circumference;
              
              const compareTopicData = showCompare ? getTopicData(topic.key, compareData) : null;
              const compareProgress = compareTopicData ? getProgressPercentage(compareTopicData) : null;
              const compareCircumference = 2 * Math.PI * 45;
              const compareStrokeDashoffset = compareProgress ? compareCircumference - (compareProgress / 100) * compareCircumference : 0;
              
              return (
                <div 
                  key={topic.key} 
                  className="progress-circle-container"
                  onClick={() => navigate(`/topic/${topic.key}`)}
                >
                  <div className="progress-circle">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="45"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="45"
                        fill="none"
                        stroke={topic.color}
                        strokeWidth="8"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                        style={{
                          filter: `drop-shadow(0 0 10px ${topic.color})`,
                          transition: "stroke-dashoffset 1s ease-in-out"
                        }}
                      />
                      {showCompare && compareProgress && (
                        <circle
                          cx="60"
                          cy="60"
                          r="35"
                          fill="none"
                          stroke={topic.color}
                          strokeWidth="6"
                          strokeDasharray={compareCircumference}
                          strokeDashoffset={compareStrokeDashoffset}
                          strokeLinecap="round"
                          transform="rotate(-90 60 60)"
                          style={{
                            filter: `drop-shadow(0 0 8px ${topic.color})`,
                            transition: "stroke-dashoffset 1s ease-in-out",
                            opacity: 0.7
                          }}
                        />
                      )}
                    </svg>
                    <div className="circle-content">
                      <div className="topic-name">{topic.name}</div>
                      <div className="progress-percentage">{Math.round(progress)}%</div>
                      {showCompare && compareProgress && (
                        <div className="compare-percentage">{Math.round(compareProgress)}%</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Maximum Rating Bar Graph Section */}
        <div className="bar-graph-section">
          <h2>🏆 Maximum Rating Achieved {showCompare && `- ${userHandle} vs ${compareHandle}`}</h2>
          <p>Highest rating problems solved in each topic</p>
          
          <div className="bar-graph-container">
            <div className="bar-graph">
              {topics.map((topic, index) => {
                const topicData = getTopicData(topic.key);
                const maxRating = topicData.maxRating || 0;
                const maxPossibleRating = 2500;
                const percentage = (maxRating / maxPossibleRating) * 100;
                
                const compareTopicData = showCompare ? getTopicData(topic.key, compareData) : null;
                const compareMaxRating = compareTopicData ? compareTopicData.maxRating || 0 : null;
                const comparePercentage = compareMaxRating ? (compareMaxRating / maxPossibleRating) * 100 : null;
                
                return (
                  <div key={topic.key} className="bar-item">
                    <div className="bar-label">
                      <span className="topic-name">{topic.name}</span>
                      <div className="rating-values">
                        <span className="rating-value">{maxRating}</span>
                        {showCompare && compareMaxRating && (
                          <span className="compare-rating-value">{compareMaxRating}</span>
                        )}
                      </div>
                    </div>
                    <div className="bar-track">
                      <div 
                        className="bar-fill"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: topic.color,
                          boxShadow: `0 0 10px ${topic.color}`
                        }}
                      />
                      {showCompare && comparePercentage && (
                        <div 
                          className="compare-bar-fill"
                          style={{
                            width: `${comparePercentage}%`,
                            backgroundColor: topic.color,
                            opacity: 0.6
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Radar Chart Section - Completely Redesigned */}
        <div className="radar-chart-section">
          <h2>📈 Performance Radar {showCompare && `- ${userHandle} vs ${compareHandle}`}</h2>
          <p>Diamond-shaped chart showing rating across all topics (0-850 scale)</p>
          
          <div className="radar-chart-container">
            <div className="radar-chart">
              <svg width="400" height="400" viewBox="0 0 400 400">
                {/* Center point */}
                <circle cx="200" cy="200" r="3" fill="white" />
                
                {/* Background grid lines */}
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, index) => (
                  <polygon
                    key={index}
                    points={Array.from({ length: 6 }).map((_, i) => {
                      const angle = (i * 60 - 90) * (Math.PI / 180);
                      const x = 200 + 150 * scale * Math.cos(angle);
                      const y = 200 + 150 * scale * Math.sin(angle);
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Topic axes and labels */}
                {topics.map((topic, index) => {
                  const angle = (index * 60 - 90) * (Math.PI / 180);
                  const x = 200 + 150 * Math.cos(angle);
                  const y = 200 + 150 * Math.sin(angle);
                  const labelX = 200 + 180 * Math.cos(angle);
                  const labelY = 200 + 180 * Math.sin(angle);
                  return (
                    <g key={topic.key}>
                      <line
                        x1="200"
                        y1="200"
                        x2={x}
                        y2={y}
                        stroke="rgba(255, 255, 255, 0.2)"
                        strokeWidth="2"
                      />
                      <text
                        x={labelX}
                        y={labelY}
                        fill={topic.color}
                        fontSize="12"
                        fontWeight="600"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
                      >
                        {topic.name}
                      </text>
                    </g>
                  );
                })}
                
                {/* Performance polygon */}
                <polygon
                  points={topics.map((topic, index) => {
                    const topicData = getTopicData(topic.key);
                    const value = getRadarValue(topicData);
                    const normalizedValue = value / 850;
                    const angle = (index * 60 - 90) * (Math.PI / 180);
                    const x = 200 + 150 * normalizedValue * Math.cos(angle);
                    const y = 200 + 150 * normalizedValue * Math.sin(angle);
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="rgba(14, 165, 233, 0.2)"
                  stroke="#0ea5e9"
                  strokeWidth="3"
                  style={{ filter: "drop-shadow(0 0 10px rgba(14, 165, 233, 0.5))" }}
                />
                
                {/* Compare polygon */}
                {showCompare && compareData && (
                  <polygon
                    points={topics.map((topic, index) => {
                      const topicData = getTopicData(topic.key, compareData);
                      const value = getRadarValue(topicData);
                      const normalizedValue = value / 850;
                      const angle = (index * 60 - 90) * (Math.PI / 180);
                      const x = 200 + 150 * normalizedValue * Math.cos(angle);
                      const y = 200 + 150 * normalizedValue * Math.sin(angle);
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="rgba(255, 107, 107, 0.2)"
                    stroke="#FF6B6B"
                    strokeWidth="2"
                    style={{ filter: "drop-shadow(0 0 10px rgba(255, 107, 107, 0.5))" }}
                  />
                )}
                
                {/* Data points */}
                {topics.map((topic, index) => {
                  const topicData = getTopicData(topic.key);
                  const value = getRadarValue(topicData);
                  const normalizedValue = value / 850;
                  const angle = (index * 60 - 90) * (Math.PI / 180);
                  const x = 200 + 150 * normalizedValue * Math.cos(angle);
                  const y = 200 + 150 * normalizedValue * Math.sin(angle);
                  return (
                    <g key={`point-${topic.key}`}>
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        fill={topic.color}
                        style={{ filter: `drop-shadow(0 0 8px ${topic.color})` }}
                      />
                      <text
                        x={x}
                        y={y - 15}
                        fill="white"
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {Math.round(value)}
                      </text>
                    </g>
                  );
                })}
                
                {/* Compare data points */}
                {showCompare && compareData && topics.map((topic, index) => {
                  const topicData = getTopicData(topic.key, compareData);
                  const value = getRadarValue(topicData);
                  const normalizedValue = value / 850;
                  const angle = (index * 60 - 90) * (Math.PI / 180);
                  const x = 200 + 150 * normalizedValue * Math.cos(angle);
                  const y = 200 + 150 * normalizedValue * Math.sin(angle);
                  return (
                    <g key={`compare-point-${topic.key}`}>
                      <circle
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#FF6B6B"
                        style={{ filter: `drop-shadow(0 0 6px #FF6B6B)` }}
                      />
                      <text
                        x={x}
                        y={y + 20}
                        fill="#FF6B6B"
                        fontSize="9"
                        fontWeight="600"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {Math.round(value)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics; 