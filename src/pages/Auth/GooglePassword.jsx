
import { useState } from "react";
import "./auth.css"; 

function GooglePassword({ show, onSubmit, onClose }) {
  const [password, setPassword] = useState("");

  if (!show) return null;

  const handleSubmit = () => {
    if (!password.trim()) {
      alert("Please enter a password");
      return;
    }
    onSubmit(password);
    setPassword("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Set Password</h2>
        <p>Create a password for manual login:</p>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default GooglePassword;
