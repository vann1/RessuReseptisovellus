import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from 'react-router-dom';


const FavoritesComponent = () => {
    const {user} = useAuthContext();
    
    const [userfavorites, setuserfavorites] = useState([]);
    const [showInfo, setShowInfo] = useState(false)
    const [showFavorites, setShowFavorites] = useState(true);

  //Etsii käyttäjän tekemät arvostelut jotka hän on merkannut suosikeiksensa.
    const SearchReviews = async () => {
      const userid = user.userid;
        try {
          const response = await fetch(`http://localhost:3001/api/review/favorites/${userid}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          }); 
        const data = await response.json();
        setShowInfo(true);
          if (response.ok) {
            setShowFavorites(true);
            
            setuserfavorites(data.data.reviews);
          } else {
            setShowFavorites(false);
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
        } catch (error) {
          console.error('Error during reviewsearch:', error.message);
          setuserfavorites([]);
        } 
            
       
      };
      //Kuvan funktio
      const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
      };

    useEffect(() => {
        
        SearchReviews();
    }, [])



  
    //Näyttää suosikki arvostelut, jos niitä on.
    return (
      <div>
         {showFavorites ? ( <div> 
        {showInfo ? <div>

        {userfavorites.length > 0 && (
        <div>
         
      <table className="favoritestable">
                  <thead  className='reciperesult-thead'>
                    <tr>
                      <th style={{fontSize : '34px'}}>Sinun suosikkisi</th>
                    </tr>
                  </thead>
                  <tbody className="favoritereciperow">
                    {userfavorites.map((recipe, index) => (
                      <tr key={index}>
                          <td style={{width : '100%'}}>
                            <div className='search-flex'>
                          <div className='search-top'>
                            <div className='search-top-column'>
                            <Link className='recipename' to={`/Recipe/${recipe.recipeid}`}>
                              <p className='border4name'></p><h2 >Resepti nimi: {recipe.recipename}</h2>
                            </Link>{" "}
                            <p className='recipecategory'><strong>Kategoria: </strong><br/>{recipe.category}</p>
                            <p><strong>Kuvaus: </strong><br/>{recipe.description}</p>
                            </div>
                            <div className='favoritesearch-image'>
                            {recipe.images ?
                                <img   className='recipeimage'  src={`data:image/jpeg;base64,${arrayBufferToBase64(recipe.images.data)}`} alt="Recipe Image"/> :
                                <img   className='alterimage' src="/pics/noimage.png" alt="No Image"/>}
                            </div>
                            </div>
                            <div className='search-bottom' style={{marginTop : '1%'}}>
                            <h4 className='recipedesctiptiontitle'>Arvostelusi: </h4>
                            <div style={{marginTop :'1%'}}>
                            {[1, 2, 3, 4, 5].map((star, index) => (
                          <span
                            id="stars"
                            key={index}
                            style={{ color: star <= recipe.rating ? '#ff9100' : 'gray' }}
                          >
                            &#9733;
                          </span>
                        ))}</div>
                            <p className='recipedesctiption'>{recipe.review}</p>
                            </div>
                            </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
          

          
        </div>
      )}

</div>: <h1>Ladataan...</h1>}
</div>
):(
            <div>
<h1>Sinulla ei ole vielä suosikki reseptejä.</h1>
</div>
          )}

        </div>
      );
}

export {FavoritesComponent};