import { useNavigate } from "react-router-dom";
const ProfileButton = () => {
    const navigate = useNavigate();
    const handleProfilePage = async () => {
        navigate('/ProfilePage');
    }


    return(
        <button onClick={handleProfilePage}>Oma profiili</button>
    )
}

export {ProfileButton}