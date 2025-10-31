import './auth.css'

import { useState } from "react";
import { EmailAuthProvider, linkWithCredential } from "firebase/auth";

function LinkGoogleModal({ user }) {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLink = async () => {
    try {
      setLoading(true);
      const credential = EmailAuthProvider.credential(user.email, password);
      await linkWithCredential(user, credential);
      setMessage("Google linked with manual login!");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setMessage("Error linking Google with manual login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button to open modal */}
      <button onClick={() => setShowModal(true)}>
        Link Google with Manual Login
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Set a Password</h3>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleLink} disabled={loading || !password}>
                {loading ? "Linking..." : "Confirm"}
              </button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {message && <p>{message}</p>}
    </>
  );
}

export default LinkGoogleModal;
