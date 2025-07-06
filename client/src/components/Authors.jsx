import { useNavigate } from "react-router-dom";
import "../styles/Authors.css";

function Authors() {
  const navigate = useNavigate();

  return (
    <div className="authors-container">
      <div className="authors-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>👨‍💻 Development Team</h1>
        <p>Meet the creators behind AlgoVerse</p>
      </div>

      <div className="authors-content">
        <div className="authors-section">
          <h2>🚀 About the Project</h2>
          <div className="about-item">
            <p>
              AlgoVerse is a comprehensive platform designed to help competitive programmers 
              track and analyze their performance on Codeforces. Our goal is to provide detailed insights 
              into problem-solving patterns and help users improve their skills through data-driven analysis.
            </p>
          </div>
        </div>

        <div className="authors-section">
          <h2>🛠️ Technology Stack</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <h3>Frontend</h3>
              <ul>
                <li>React.js</li>
                <li>CSS3 with Modern Animations</li>
                <li>Responsive Design</li>
              </ul>
            </div>
            <div className="tech-item">
              <h3>Backend</h3>
              <ul>
                <li>Node.js & Express</li>
                <li>MongoDB</li>
                <li>Codeforces API Integration</li>
              </ul>
            </div>
            <div className="tech-item">
              <h3>Features</h3>
              <ul>
                <li>Real-time Analytics</li>
                <li>Topic-wise Analysis</li>
                <li>Leaderboard System</li>
                <li>Performance Tracking</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="authors-section">
          <h2>📊 Key Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <h3>📈 Analytics Dashboard</h3>
              <p>Comprehensive analysis of your Codeforces performance across different topics and difficulty levels.</p>
            </div>
            <div className="feature-item">
              <h3>🏆 Leaderboard</h3>
              <p>Compare your performance with other users using our custom scoring algorithm.</p>
            </div>
            <div className="feature-item">
              <h3>🎯 Topic Analysis</h3>
              <p>Detailed breakdown of your strengths and weaknesses in specific problem categories.</p>
            </div>
            <div className="feature-item">
              <h3>⚡ Real-time Data</h3>
              <p>Live integration with Codeforces API for up-to-date performance metrics.</p>
            </div>
          </div>
        </div>

        <div className="authors-section">
          <h2>🤝 Contributing</h2>
          <div className="contributing-item">
            <p>
              This project is open for contributions! If you have ideas for improvements, 
              bug reports, or want to add new features, feel free to reach out to the development team.
            </p>
            <p>
              We're always looking to enhance the platform and make it more useful for the 
              competitive programming community.
            </p>
          </div>
        </div>

        <div className="authors-section">
          <h2>📞 Contact</h2>
          <div className="contact-item">
            <p>
              For questions, suggestions, or support, please email at btech10133.23@bitmesra.ac.in
            </p>
            <p>
              <strong>Thank you for using AlgoVerse!</strong> 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Authors; 