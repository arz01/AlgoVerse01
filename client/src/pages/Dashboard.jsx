import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import GeminiChat from "../components/GeminiChat";
import CodeforcesHandle from "../components/CodeforcesHandle";

const codeforcesTopics = [
    {
        title: "Implementation",
        image: "implementation.png",
        description: "Master the art of translating algorithms into code. Focus on clean, efficient implementations, handling edge cases, and optimizing solutions for competitive programming challenges."
    },
    {
        title: "Dynamic Programming",
        image: "dp.png",
        description: "Learn to solve complex problems by breaking them into simpler subproblems. Master memoization, tabulation, and various DP techniques like knapsack, LIS, and state compression."
    },
    {
        title: "Data Structures",
        image: "datastructures.png",
        description: "Explore fundamental and advanced data structures including arrays, linked lists, stacks, queues, trees, and graphs. Learn when and how to use each structure effectively."
    },
    {
        title: "Algorithms",
        image: "algorithms.png",
        description: "Master essential algorithms including sorting, searching, binary search, two pointers, greedy algorithms, and divide-and-conquer techniques for efficient problem solving."
    },
    {
        title: "Mathematics",
        image: "math.png",
        description: "Dive into mathematical concepts including number theory, combinatorics, probability, geometry, and modular arithmetic essential for competitive programming."
    },
    {
        title: "Graph Theory",
        image: "graphtheory.png",
        description: "Explore graph algorithms including DFS, BFS, shortest paths, minimum spanning trees, topological sorting, and advanced graph techniques for complex problem solving."
    }
];



function Dashboard() {
    const navigate = useNavigate();
    const [userHandle, setUserHandle] = useState(null);
    const [quickStats, setQuickStats] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            fetchUserProfile();
        }
    }, [navigate]);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/auth/profile", {
                headers: {
                    "x-auth-token": token,
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.user.codeforcesHandle) {
                    setUserHandle(data.user.codeforcesHandle);
                    fetchQuickStats(data.user.codeforcesHandle);
                }
            }
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
        }
    };

    const fetchQuickStats = async (handle) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/api/codeforces/${handle}/summary`, {
                headers: {
                    "x-auth-token": token,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const stats = {
                    totalSolved: Object.values(data).reduce((sum, topic) => sum + (topic.solved || 0), 0),
                    maxRating: Math.max(...Object.values(data).map(topic => topic.maxRating || 0)),
                    topicsWithProblems: Object.values(data).filter(topic => topic.solved > 0).length,
                    totalTopics: Object.keys(data).length
                };
                
                // Calculate average rating
                let totalRating = 0;
                let totalProblems = 0;
                Object.values(data).forEach(topic => {
                    if (topic.problems && topic.problems.length > 0) {
                        topic.problems.forEach(problem => {
                            if (problem.rating) {
                                totalRating += problem.rating;
                                totalProblems++;
                            }
                        });
                    }
                });
                stats.averageRating = totalProblems > 0 ? Math.round(totalRating / totalProblems) : 0;
                setQuickStats(stats);
            }
        } catch (error) {
            console.error("Failed to fetch quick stats:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="dashboard-header-bg">
                <div className="dashboard-header-content">
                    <h1 className="dashboard-title">AlgoVerse</h1>
                    <p className="dashboard-desc">
                        Welcome to AlgoVerse – your comprehensive platform for analyzing competitive programming performance. Track your progress, identify strengths, and optimize your learning path!
                    </p>
                </div>
            </div>
            <div className="dashboard-container">
                <Sidebar />
                <div className="dashboard-main">
                    <CodeforcesHandle />
                    
                    <h2
                        className="dashboard-subtitle"
                        style={{ paddingTop: "2rem", textAlign: "center" }}
                    >
                        Competitive Programming Topics:<br />
                        <span style={{ fontWeight: 400 }}>
                            Analyze your performance in different areas
                        </span>
                    </h2>

                    <div className="card-grid">
                        {codeforcesTopics.map((topic) => (
                            <Card key={topic.title} title={topic.title} image={topic.image} description={topic.description} />
                        ))}
                    </div>

                    {/* Quick Stats Section */}
                    {userHandle && (
                        <div className="quick-stats-section">
                            <h2 className="quick-stats-title">📊 Quick Stats</h2>
                            <p className="quick-stats-subtitle">Your competitive programming journey at a glance</p>
                            
                            {loading ? (
                                <div className="quick-stats-loading">
                                    <div className="loading-spinner"></div>
                                    <p>Loading your stats...</p>
                                </div>
                            ) : quickStats ? (
                                <div className="quick-stats-grid">
                                    <div className="stat-card">
                                        <div className="stat-icon">🎯</div>
                                        <div className="stat-content">
                                            <div className="stat-number">{quickStats.totalSolved}</div>
                                            <div className="stat-label">Problems Solved</div>
                                        </div>
                                    </div>
                                    
                                    <div className="stat-card">
                                        <div className="stat-icon">🏆</div>
                                        <div className="stat-content">
                                            <div className="stat-number">{quickStats.maxRating}</div>
                                            <div className="stat-label">Max Rating Achieved</div>
                                        </div>
                                    </div>
                                    
                                    <div className="stat-card">
                                        <div className="stat-icon">📚</div>
                                        <div className="stat-content">
                                            <div className="stat-number">{quickStats.topicsWithProblems}</div>
                                            <div className="stat-label">Topics Explored</div>
                                        </div>
                                    </div>
                                    
                                    <div className="stat-card">
                                        <div className="stat-icon">📊</div>
                                        <div className="stat-content">
                                            <div className="stat-number">{quickStats.averageRating}</div>
                                            <div className="stat-label">Avg Rating of question solved</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="quick-stats-empty">
                                    <p>Set your Codeforces handle to see your stats!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <GeminiChat />
        </div>
    );
}

export default Dashboard;