import { useNavigate } from "react-router-dom";
const AdminButton = () => {
    const navigate = useNavigate();
    const handleAdminPage = async () => {
        navigate('/AdminPage');
    }
    return(
        <button onClick={handleAdminPage}>Ylläpito sivu</button>
    )
}

export {AdminButton}