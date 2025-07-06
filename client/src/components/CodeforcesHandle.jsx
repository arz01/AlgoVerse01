import { useState, useEffect } from "react";
import "../styles/CodeforcesHandle.css";
import { API_URL } from "../config";

function CodeforcesHandle() {
  const [handle, setHandle] = useState("");
  const [savedHandle, setSavedHandle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user.codeforcesHandle) {
          setSavedHandle(data.user.codeforcesHandle);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setIsLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/auth/codeforces-handle`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ codeforcesHandle: handle.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setSavedHandle(handle.trim());
        setHandle("");
        setIsEditing(false);
        setMessage("Codeforces handle saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.msg || "Error saving handle");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setHandle(savedHandle || "");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setHandle("");
    setMessage("");
  };

  if (savedHandle && !isEditing) {
    return (
      <div className="cf-handle-container">
        <div className="cf-handle-display">
          <div className="cf-logo-container">
            <img src="/assets/cf-logo.png" alt="Codeforces" className="cf-logo" />
          </div>
          <div className="cf-handle-info">
            <span className="cf-handle-label">Codeforces Handle:</span>
            <span className="cf-handle-value">{savedHandle}</span>
          </div>
          <div className="cf-handle-actions">
            <button className="cf-edit-btn" onClick={handleEdit}>
              Edit
            </button>
            <div className="cf-check-icon">✓</div>
          </div>
        </div>
        {message && <div className="cf-message success">{message}</div>}
      </div>
    );
  }

  return (
    <div className="cf-handle-container">
      <form onSubmit={handleSubmit} className="cf-handle-form">
        <div className="cf-input-group">
          <div className="cf-logo-container">
            <img src="/assets/cf-logo.png" alt="Codeforces" className="cf-logo" />
          </div>
          <div className="cf-input-wrapper">
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="Enter your Codeforces username (e.g., tourist, Petr)"
              className="cf-input"
              required
            />
            <button type="submit" className="cf-submit-btn" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
          <p className="cf-help-text">
            Just enter your Codeforces username, not the full profile URL
          </p>
        </div>
        {isEditing && (
          <button type="button" className="cf-cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>
      {message && (
        <div className={`cf-message ${message.includes("successfully") ? "success" : "error"}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default CodeforcesHandle; 