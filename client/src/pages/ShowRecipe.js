import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RatingComponent } from '../components/ReviewComponent';
import { useAuthContext } from "../hooks/useAuthContext";



const ShowRecipe = () => {
  const [emailSent, setEmailSent] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [reciverEmail, setReciverEmail] = useState('');
  const [disabled, setDisabled] = useState(false);
  const { recipeId } = useParams();
  const {user} = useAuthContext();
  const [localhostAddress, setLocalhostAddress] = useState('http://localhost:3000/Recipe/' + recipeId);
  const [ingredients, setIngredients] = useState([]);

  const handleSearch = async () => { //Searches recipe that is shown on the page, uses recipeId to find it
    try {
      const response = await fetch('http://localhost:3001/api/recipe/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeid: recipeId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data.data.recipes);
    } catch (error) {
      console.error('Error during search:', error.message);
      setSearchResults([]);
    }

 

  };

  const getIngredients = async () => { //Searches ingredients for the shown recipe, uses recipeId to find them
    try {
      const response = await fetch(`http://localhost:3001/api/ingredients/${recipeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setIngredients(data.data.ingredients);

 
    } catch (error) {
      console.error('Error during search:', error.message);
    }
  }
 
  useEffect(() => {
    getIngredients();
    handleSearch();
  }, [recipeId]);


  const sendRecipeToEmail = async () => { //sends the link to email that user has inserted, link takes to currently watched recipe
    setEmailSent('');
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 1000)
    try {
      const response = await fetch('http://localhost:3001/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          recipePageAddress: localhostAddress,
          senderEmail: user.email,
          reciverEmail: reciverEmail
        }),
      });

      if (!response.ok) {
        setEmailSent('Sähköpostia ei ole olemassa ❌ Tarkista sähköposti.')
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if(response.ok) {
        setEmailSent('Resepti lähetetty ✔️')
      }
      console.log("Resepti lähetetty sähköpostiin")
    } catch (error) {
      console.error('Error sending recipe to email:', error.message);
    }

  }

 
  return (
    <div className='showrecipe-container'>
      {searchResults.length > 0 && (
        <div>
          {searchResults.map((recipe) => (
            <div key={recipe.recipeid}>
              <h1 className="recipenameshow">{recipe.recipename}</h1>
              <div className='recipeinfo-container'>
                <div className='recipeinfobox1'>
                  {recipe.images ? (
                    <div>                   
                      <img className='recipeimage' src={`data:image/jpeg;base64,${arrayBufferToBase64(recipe.images.data)}`} alt="Recipe Image"/>
                    </div>
                  ):(
                    <div></div>
                  )}
                  <div className='recipeshowingredients'>
                    <h3>Ainesosat:</h3>
                    <table>
                      <thead>
                        <tr>
                          <th className='showrecipetable20'>Määrä</th>
                          <th className='showrecipetable20'> Mitta</th>
                          <th className='showrecipetable40'>Ainesosa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ingredients.map((ingredient, index) => (
                          <tr key={index}>
                            <td className='showrecipetable20'>{ingredient.quantity}</td>
                            <td className='showrecipetable20'>{ingredient.measure}</td>
                            <td className='showrecipetable40'>{ingredient.ingredientname}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className='recipeinfobox2'>
                  <p><strong>Tekijä:</strong> {recipe.username}</p>
                  <p><strong>Kategoria:</strong> {recipe.category}</p>
                  <p><strong>Kuvaus:</strong> {recipe.description}</p>
                  <p><strong>Tagit:</strong> {recipe.tags}</p>
                  <p><strong>Ohje:</strong> {recipe.instructions}</p>
                </div>  
              </div>
              <div className='sharerecipebox'>
                {user && (
                  <div className='email-form'>
                    <h3>Jaa resepti</h3>
                    <label>Sähköposti: </label>
                    <input className='email-input-field' type="text" onChange={(e) => setReciverEmail(e.target.value)}></input>
                    <button className="email-send-button" disabled={disabled} onClick={() => sendRecipeToEmail()}>Lähetä</button>
                    {emailSent && (<p>{emailSent}</p>)}
                  </div>
                )}
              </div>
              <div className='ratingbox'>
                {user ? (
                  <RatingComponent userid={user.userid} recipeid={recipe.recipeid} />
                ) : (
                  <RatingComponent recipeid={recipe.recipeid}/>
                )}
              </div>           
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  
};

// Converts the photo from database to visible form
const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export default ShowRecipe;











