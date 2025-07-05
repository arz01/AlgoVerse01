import "../styles/Sidebar.css";
import { Link } from "react-router-dom";
import { useState } from "react";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {collapsed ? "➡️" : "⬅️"}
      </button>

      {!collapsed && <h2>DS Visualizer</h2>}

      <ul>
        <li><Link to="/dashboard">{collapsed ? "🏠" : "🏠 Home"}</Link></li>
        <li><Link to="/progress">{collapsed ? "📈" : "📈 Progress Chart"}</Link></li>
        <li><Link to="/leaderboard">{collapsed ? "🏆" : "🏆 Leaderboard"}</Link></li>
        <li><Link to="/help">{collapsed ? "❓" : "❓ Help / FAQs"}</Link></li>
        <li><Link to="/authors">{collapsed ? "👨‍💻" : "👨‍💻 Authors"}</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
