import { useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from "../hooks/useAuthContext";
import '../styles/styles.css'

const PasswordChangePage = () => {
    const { userId } = useParams();
    const {user} = useAuthContext();
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [messages, setMessages] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();
    const handleChangePassword = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/user/password/change', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                password: password,
                newPassword: newPassword,
                userId: userId
            }),   
        });
        const data = await response.json();
        if(!response.ok){
            if(response.status === 401) {
                setIsError(true);
                setMessages("Väärä salasana.");
            }
            if(response.status === 400) {
                setIsError(true);
                setMessages("Salasana ei ole tarpeeksi vahva. Vähintään 8 merkkiä, iso kirjain ja numero vaaditaan.");
            }
            throw new Error(data.error)
        }
        setIsError(false);
        setMessages("Salasana vaihdettu onnistuneesti.");
        setTimeout(() => {
            navigate('/ProfilePage')
        }, 2000)
        } catch(error) {
            console.error(error);
        }
    }

    return (
    <div className='Login-container'>
        <div className='Changepassword-form'>
            <div className='Register-h1'>
                <h1>Vaihda salasanasi</h1>
            </div>
            <div className='Register-p'>
            <p>Voit vaihtaa salasanasasi alhaalla olevalta lomakkeelta.</p>
            </div>
            <div className='login-inputs'>
            <input
            className="regInput register-input-field"
            type="password"
            placeholder="Salasana"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <br></br>
            <input
            className="regInput register-input-field"
            type="password"
            placeholder="Uusi salasana"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            />
            </div>
            <br></br>
            <button className="changepassword-button" onClick={() => handleChangePassword()}>Vaihda salasana</button>
            <p className="changepassword-messages" style={{ color: isError ? 'red' : 'green' }}>{messages}</p>
        </div>
    </div>
      );
}


export {PasswordChangePage}