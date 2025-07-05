import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/Login"; // we are using Login.jsx for both
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* We'll add dashboard route later */}
    </Routes>
  );
}

export default App;
