import { useState , useContext} from "react";
import { Link } from 'react-router-dom';
import '../styles/styles.css'
const LoginForm = ({onLogin, virheViesti, isLoading}) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessages, setErrorMessages] = useState('');
  const handleLogin = () => {
    setErrorMessages('')
    onLogin(email, password);
}
  return (
    <div  className='Login-form'>
      <div className='Register-h1'>
        <h1>Kirjaudu</h1>
      </div>
      <div className='Register-p'>
        <p>Kirjaudu alla olevasta lomakkeesta jatkaaksesi luomaan ja jakamaan omia reseptejä!</p>
      </div>
      <div className='login-inputs'>
      <input
        type="text"
        placeholder="Sähköposti"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="regInput register-input-field"
      />
      <br></br>
       <input
        type="password"
        placeholder="Salasana"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="regInput register-input-field"
      />
      </div>
      <br></br>
      <p className="loginError">{virheViesti}</p>
      <button className="Register-button" onClick={handleLogin} disabled={isLoading}>Kirjaudu</button>
      <br></br>
      <div className="loginform-links">
      <Link to={`/RegisterPage`}><p>Luo käyttäjä</p></Link>
      <Link to={`/Password`}><p className="loginform-link" >Unohtuiko salasana?</p></Link>
      </div>
    </div>
  );
};

export default LoginForm;