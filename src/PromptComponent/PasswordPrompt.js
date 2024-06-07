import React, { useState } from 'react';
import './PasswordPrompt.css';

const PasswordPrompt = ({ onConfirm, onCancel }) => {
  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    onConfirm(password);
  };

  return (
    <div className="password-prompt-backdrop">
      <div className="password-prompt">
        <h3>Confirm Cancellation</h3>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="password-prompt-buttons">
          <button onClick={handleConfirm} className="btn confirm-btn">Confirm</button>
          <button onClick={onCancel} className="btn cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PasswordPrompt;
