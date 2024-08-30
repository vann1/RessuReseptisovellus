import React, { useState } from "react";
import "../styles/styles.css";

const LostPasswordForm = ({ errorMessage, successMessage, clearMessages, isLoading, sendReturnCode }) => {
  const [email, setEmail] = useState("");

  const handleSendReturnCode = () => { //triggers the functions in LostPasswordPage.js
    clearMessages();
    sendReturnCode(email);
  };

  return (
    <div className='LostPassword-form'>
    <div>
      <div className='Register-h1'>
        <h1>Palauta salasana</h1>
        </div>
      <div className='Register-p'>
        <p>Syötä tunnuksellesi rekisteröity sähköpostiosoite, johon lähetämme uuden salasanan</p>
      </div>
    <div className='login-inputs'>
      <input
        type="text"
        placeholder="Sähköposti"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="regInput register-input-field"
      />
      </div>
      <button  className="Register-button" onClick={handleSendReturnCode} disabled={isLoading}>
        Palauta salasana
      </button>
      <p>{errorMessage}</p>
      <p>{successMessage}</p>
      </div>
    </div>
  );
};

export default LostPasswordForm;

