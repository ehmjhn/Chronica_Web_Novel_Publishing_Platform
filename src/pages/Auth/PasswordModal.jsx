import { useState } from "react";
import "./auth.css";

export default function PasswordModal({onConfirm, onCancel }) {
  const [password, setPassword] = useState("");

  return (
    <div className="password-modal-overlay">
      <div className="password-modal">
        <h3>Set a Password</h3>
        <p>This will allow you to log in manually next time.</p>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="modal-actions">
          <button
            onClick={() => onConfirm(password)}
            disabled={!password.trim()}
          >
            Confirm
          </button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
