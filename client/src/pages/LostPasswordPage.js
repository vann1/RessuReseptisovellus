import React, { useState } from "react";
import LostPasswordForm from "../components/LostPasswordForm";

const LostPassword = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendReturnCode = async (email) => { //sends the new password to requested email address
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3001/api/email/recover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setIsLoading(false);

      if (!response.ok) {
        setErrorMessage("Sähköpostia ei ole rekisteröity");
      } else {
        setSuccessMessage("Salasana palautettu onnistuneesti");
      }
    } catch (error) {
      console.error("Error sending password recovery email:", error);
      setErrorMessage("Virhe palautettaessa salasanaa");
      setIsLoading(false);
    }
  };

  const clearMessages = () => { //Clears the success/error messages in case user inserts new email
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div className='Login-container'>
      <LostPasswordForm
        errorMessage={errorMessage}
        successMessage={successMessage}
        clearMessages={clearMessages}
        isLoading={isLoading}
        sendReturnCode={sendReturnCode}
      />
    </div>
  );
};

export default LostPassword;
