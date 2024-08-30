import React, { useState } from 'react';
import '../styles/styles.css'
const RegisterForm = ({ onRegister, emailExist }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessages, setErrorMessages] = useState({});
  const [disabled, setDisabled] = useState(false);
  const handleRegister = () => {

    setErrorMessages({});
    if(validateAll(name, password, email, username)){
    onRegister(name, password, email, username);
    //disable button for 1 second for backend response
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 1000)
    }
    else {
      return false;
    };
  };

  function validatePassword(password) {
    // Check for at least 8 characters
    if (password.length < 8) {
      setErrorMessages((prevState) => ({
        ...prevState,
        password: "Salasanan täytyy olla vähintään 8 merkkiä",
      }));
      console.log("Salasanan täytyy olla vähintää 8 merkkiä")
      return false;
    }
  
    // Check for at least one uppercase letter
    let uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) {
      setErrorMessages((prevState) => ({
        ...prevState,
        password: "Salasanassa täytyy olla vähintään yksi isokirjain",
      }));
      console.log("Salasanassa täytyy olla vähintään yksi isokirjain")
      return false;
    }
  
    // Check for at least one number
    var numberRegex = /\d/;
    if (!numberRegex.test(password)) {
      setErrorMessages((prevState) => ({
        ...prevState,
        password: "Salasanassa täytyy olla vähintään yksi numero",
      }));
      console.log("Salasanassa täytyy olla vähintään yksi numero")
      return false;
    }
    
    // All conditions met
    return true;
  }

  function validatename(name) {
    if(name === '') {
      console.log("Nimi kenttä tyhjä")
      setErrorMessages((prevState) => ({
        ...prevState,
        name: "Nimi kenttä tyhjä",
      }));
      return false;
    }
    return true;
  }
  function validateusername(username) {
    if(username === '') {
      console.log("Nimimerkki kenttä tyhjä")
      setErrorMessages((prevState) => ({
        ...prevState,
        username: "Nimimerkki kenttä tyhjä",
      }));
      return false;
    }
    return true;
  }
  function validateEmail(email) {
    // Regular expression pattern for a basic email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Test if the provided email matches the pattern
    var isValid = emailRegex.test(email);
    if(!isValid) {
      console.log("Sähköposti ei ole oikein kirjoitettu")
      setErrorMessages((prevState) => ({
        ...prevState,
        email: "Sähköposti ei ole oikein kirjoitettu",
      }));
      return false;
    }
    return isValid;
  } 

  function validateAll(name, password, email, username) {
    const isnameValid = validatename(name);
    const isPasswordValid = validatePassword(password);
    const isEmailValid = validateEmail(email);
    const isusernameValid = validateusername(username);
  
    // Check if all validations are true
    if (isPasswordValid && isnameValid && isusernameValid && isEmailValid) {
      return true;
    } else {
      return false;
    }
  }

  //tyhjentää localstoragen
  function tyhjennaTestiKayttajat() {
    localStorage.clear();
  }
  
  return (
    <div className='Register-form'>
      <div className='Register-h1'>
          <h1>Rekisteröidy</h1>
      </div>
      <div className='Register-p'>
        <p>Tervetuloa Ressuun! Voit luoda Ressu-käyttäjän alhaalla olevalla lomakkeella.</p>
      </div>
      <div className='register-inputs'>
      <input
        type="text"
        placeholder="Nimi"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="regInput register-input-field"
      />
      {errorMessages.name && (
        <p className="pError">{errorMessages.name}</p>
      )}
            <br></br>
       <input
        type="password"
        placeholder="Salasana"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="regInput register-input-field"
      />
      {errorMessages.password && (
        <p className="pError">{errorMessages.password}</p>
      )}
            <br></br>
      <input
        type="text"
        placeholder="Sähköposti"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="regInput register-input-field"
      />
      {errorMessages.email && <span className="infoText">?</span>}
    {errorMessages.email && <p className="pError">{errorMessages.email}</p>}
    <br></br>
      <input
        type="text"
        placeholder="Nimimerkki"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="regInput register-input-field"
      />
      {errorMessages.username && <p className="pError">{errorMessages.username}</p>}
      </div>
      <br></br>
      <div className='Register-button-div'>
      <button  className='Register-button' onClick={handleRegister} disabled={disabled}>Luo käyttäjä</button>
      <p className='emailExist' style={{color:'red'}}>{emailExist}</p>
      </div>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
};

export default RegisterForm;