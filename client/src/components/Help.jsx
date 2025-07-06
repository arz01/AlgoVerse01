import { useNavigate } from "react-router-dom";
import "../styles/Help.css";

function Help() {
  const navigate = useNavigate();

  return (
    <div className="help-container">
      <div className="help-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>❓ Help & FAQs</h1>
        <p>Everything you need to know about AlgoVerse</p>
      </div>

      <div className="help-content">
        <div className="help-section">
          <h2>🚀 Getting Started</h2>
          <div className="help-item">
            <h3>1. Set Your Codeforces Handle</h3>
            <p>Go to your dashboard and enter your Codeforces username (handle) in the input field. Make sure to enter only your username, not the full URL.</p>
            <p><strong>Example:</strong> If your profile is <code>https://codeforces.com/profile/tourist</code>, enter <code>tourist</code></p>
          </div>

          <div className="help-item">
            <h3>2. View Your Analytics</h3>
            <p>Once your handle is set, you can view detailed analytics about your problem-solving performance across different topics.</p>
          </div>

          <div className="help-item">
            <h3>3. Check the Leaderboard</h3>
            <p>Compare your performance with other users on the leaderboard, ranked by our custom scoring system.</p>
          </div>
        </div>

        <div className="help-section">
          <h2>📊 Understanding Analytics</h2>
          <div className="help-item">
            <h3>Topic Analysis</h3>
            <p>Each topic card shows:</p>
            <ul>
              <li><strong>Problems Solved:</strong> Total unique problems in that topic</li>
              <li><strong>Max Rating:</strong> Highest rated problem you've solved</li>
              <li><strong>Average Rating:</strong> Average difficulty of problems solved</li>
              <li><strong>Next Recommended:</strong> Suggested rating for your next problem</li>
            </ul>
          </div>

          <div className="help-item">
            <h3>Scoring System</h3>
            <p>Leaderboard scores are calculated using:</p>
            <ul>
              <li><strong>Rating Points:</strong> Current CF Rating × 0.5</li>
              <li><strong>Problem Points:</strong> Total Solved × 10</li>
              <li><strong>Difficulty Bonus:</strong> Hard Problems (1600+) × 5</li>
            </ul>
          </div>
        </div>

        <div className="help-section">
          <h2>🔧 Troubleshooting</h2>
          <div className="help-item">
            <h3>Handle Not Found</h3>
            <p>If you get a "User not found" error:</p>
            <ul>
              <li>Double-check your Codeforces handle spelling</li>
              <li>Make sure the handle exists and is public</li>
              <li>Try refreshing the page and entering again</li>
            </ul>
          </div>

          <div className="help-item">
            <h3>No Data Showing</h3>
            <p>If no analytics appear:</p>
            <ul>
              <li>Ensure you have solved problems on Codeforces</li>
              <li>Check that your handle is correctly set</li>
              <li>Wait a few minutes and try again (API rate limits)</li>
            </ul>
          </div>
        </div>

        <div className="help-section">
          <h2>📈 Tips for Better Performance</h2>
          <div className="help-item">
            <h3>Improve Your Score</h3>
            <ul>
              <li>Solve more problems to increase your problem points</li>
              <li>Focus on harder problems (1600+ rating) for bonus points</li>
              <li>Participate in contests to improve your rating</li>
              <li>Practice consistently across different topics</li>
            </ul>
          </div>
        </div>

        <div className="help-section">
          <h2>💬 Support</h2>
          <div className="help-item">
            <p>If you're still having issues, please check:</p>
            <ul>
              <li>Your internet connection</li>
              <li>Codeforces website status</li>
              <li>That you're logged in to the application</li>
            </ul>
            <p>For technical support, contact the development team.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help; 