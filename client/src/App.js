import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/Login"; // we are using Login.jsx for both
import Dashboard from "./pages/Dashboard";
import TopicDetails from "./components/TopicDetails";
import Leaderboard from "./components/Leaderboard";
import Help from "./components/Help";
import Authors from "./components/Authors";
import Analytics from "./components/Analytics";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/topic/:topic" element={<TopicDetails />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/help" element={<Help />} />
      <Route path="/authors" element={<Authors />} />
      {/* We'll add dashboard route later */}
    </Routes>
  );
}

export default App;