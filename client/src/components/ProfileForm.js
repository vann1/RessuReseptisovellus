import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import {Link} from 'react-router-dom';
const ProfileForm = () => {
    const [userRecipes, setUserRecipes] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const {user} = useAuthContext();
    const [showInfo, setShowInfo] = useState(false)
    const [showNoRecipes, setShowNoRecipes] = useState()
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/user/profile', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                  },
                  body: JSON.stringify({ email: user.email }),
                });
                const data = await response.json();
                if (!response.ok) {
                  throw new Error(data.error);
                }
                if (response.ok) {
                    setUserDetails(data.data.userWithoutPassword)
                } 
              } catch (error) {
                console.error('Error:', error);
              }
        }
        getUserDetails();
    },[])

    useEffect(() => {
      // Load user recipes whenever userRecipes state changes
      getUserRecipes();
  }, [refresh])

    const getUserRecipes = async () => {
      const userid = user.userid;
      try {
        const response = await fetch(`http://localhost:3001/api/user/profile/${userid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
        });
        const data = await response.json();
        if (!response.ok) {
          setShowNoRecipes(true)
          throw new Error(data.error);
        }
          if (response.ok) {
            setShowNoRecipes(false)
            setUserRecipes(data.data.result);
            setShowInfo(true);
        } 
      } catch (error) {
        console.error('Error:', error);
      }
    }

    const deleteRecipe = async (recipeid) => {
      try {
          const response = await fetch(`http://localhost:3001/api/recipe/${recipeid}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          if(response.ok){
            setRefresh((prev) => !prev)
            console.log('Recipe deleted');
          }
        } catch (error) {
          console.error('Error deleting recipe:', error.message);
        }
  }

    return (
      <div>
            <h1 className="h1-profile">Oma profiili</h1>
            <div className="container-profile">
            <div className="userinfo">
            <p><strong>Käyttäjänimi: </strong> {userDetails.username}</p>
            <p><strong>Nimi: </strong>{userDetails.name}</p>
            <p><strong>Sähköposti: </strong>{userDetails.email}</p>
            <p><strong>ID: </strong>{userDetails.userid}</p>
            <Link className="changepassword-link" to={`/changepassword/${userDetails.userid}`}><p className='border4PasswordChange'>Vaihda salasana</p></Link>
            </div>
{showNoRecipes ? <div> <h1>Sinulla ei ole vielä reseptejä</h1>
          </div> :
          <div>
            
            {showInfo ? <div>
            <h1 className="h1-profile">Omat reseptit</h1>
            <div className="profilerecipes">
              
              <table>
                <thead className="thead-profile">
                  <tr className="profilerecipethead">
                    <th>Nimi</th>
                    <th>Kategoria</th>
                    <th>Poista</th>
                  </tr>
                </thead>
                <tbody>
                {userRecipes.map((recipe, index) => (
                <tr key={index} className="profilerecipetbody">
                  <td>
                    <Link className="link-profile-recipe" to={`/userrecipe/${recipe.recipeid}`}>
                    <p className='border4name'></p><p>{recipe.recipename}</p>
                    </Link>{" "}
                  </td>
                  <td>
                    <p>{recipe.category}</p>
                  </td>
                  <td>
                    <button className="recipe-delete-button" onClick={() => deleteRecipe(recipe.recipeid)}>Poista</button>
                  </td>        
                </tr>
              ))}
                </tbody>
              </table>
            </div>
            </div>: <h1>Ladataan...</h1>}
            </div>}
        </div>
        </div>
      );
}
export {ProfileForm}