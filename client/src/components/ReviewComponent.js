import React, {  useEffect, useState } from 'react';
import '../styles/styles.css'


const RatingComponent = (props) => {

    const [userRating, setUserRating] = useState(0);
    const [userFavorite, setUserFavorite] = useState(0);
    const [comment, setComment] = useState('');
    const [userEditRating, setUserEditRating] = useState(0);
    const [userEditFavorite, setUserEditFavorite] = useState(0);
    const [Editcomment, setEditComment] = useState('');
    const [recipeReviews, setRecipeReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [recipeid, setRecipeID] = useState(props.recipeid);


    const handleRatingChange = (rating) => {
        setUserRating(rating);
      };
    
    const handleCommentChange = (event) => {
    setComment(event.target.value);
    };
    
    const handleCheckboxChange = () => {
        setUserFavorite(userFavorite === 0 ? 1 : 0);
        
      };

      const handleEditRatingChange = (rating) => {
        setUserEditRating(rating);
      };
    
    const handleEditCommentChange = (event) => {
    setEditComment(event.target.value);
    };
    
    const handleEditCheckboxChange = () => {
      setUserEditFavorite(userEditFavorite === 0 ? 1 : 0);
        
      };





      //Etsii arvostelut tietokannasta
    const SearchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/review/search/${recipeid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setRecipeReviews(data.data.reviews);
        
      } catch (error) {
        console.error('Error during reviewsearch:', error.message);
        setRecipeReviews([]);
      } 


      
  
    };

  
    useEffect(() => {
      SearchReviews();
    },[])
    //Jos kirjautunut käyttäjä on tehnyt arvostelun reseptiin, sitä ei näytettä arvosteluissa, vaan uusi arvostelu muuttuu muokkaa arvostelu jossa oma arvostelu näkyy.
    const removeUserReview = () => {
      const userReviewIndex = recipeReviews.findIndex(review => review.userid === props.userid);
      if (userReviewIndex !== -1) {
        const removedReview = recipeReviews.splice(userReviewIndex, 1)[0];
        
        setUserReview(removedReview);
        setRecipeReviews([...recipeReviews]);
        setUserEditFavorite(removedReview.favorite);
        setUserEditRating(removedReview.rating);
        setEditComment(removedReview.review)
       
      } else {
        setUserReview(null);
      }
    };
  
    useEffect(() => {
      if(Array.isArray(recipeReviews)){
        const hasUserReview = recipeReviews.some(review => review.userid === props.userid);
      if (hasUserReview) {
        removeUserReview();
      }
      }
      
    }, [recipeReviews, props.userid]);

    //Arvostelun muokkaaminen
    const updateReview = async () => {
      try {
          const response = await fetch('http://localhost:3001/api/review/edit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              recipeid: props.recipeid,
              userid: props.userid,
              rating: userEditRating,
              comment: Editcomment,
              favorite: userEditFavorite,
              reviewid: userReview.reviewid
            }),
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        } catch (error) {
          console.error('Error editing review:', error.message);
        } 
        
        
    };

    //Arvostelun poistaminen
    const deleteReview = async () => {
      const reviewid = userReview.reviewid;
      try {
          const response = await fetch(`http://localhost:3001/api/review/delete/${reviewid}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        } catch (error) {
          console.error('Error deleting review:', error.message);
        } 
        
        setUserReview(null);
     

    };

    //Arvostelun lisääminen
    const handleSubmit = async () => {
      if(userRating && comment) {
      try {
          const response = await fetch('http://localhost:3001/api/review/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              recipeid: props.recipeid,
              userid: props.userid,
              rating: userRating,
              comment: comment,
              favorite: userFavorite,
            }),
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        } catch (error) {
          console.error('Error adding review:', error.message);
        } 
        window.location.reload();

    } else {
      alert("Täytä arvostelu.");
    }

    };



    //Alhaalla palautetaan arvostele resepti, jos kirjautuneella käyttäjällä ei ole reseptille arvostelua ja näytetään muokkaa resepti jo on.
    return(
            <div>
      
              {props.userid ? (
                
                 <div>
                  {!userReview ? (
                <div>
                <div>
                  <strong>Arvostele resepti:</strong><br />
                  {[1, 2, 3, 4, 5].map((star, index) => (
                    <span
                      key={index}
                      style={{ cursor: 'pointer', color: star <= userRating ? '#ff9100' : 'gray' }}
                      onClick={() => handleRatingChange(star)}
                    >
                      &#9733;
                    </span>
                  ))}
                  <br></br><input
                    type="checkbox"
                    checked={userFavorite}
                    onChange={handleCheckboxChange}
                  /> Lisää suosikkeihin.
                </div>
                <div style={{ marginTop: '10px' }}>
                  <textarea 
                    placeholder="Leave a comment..."
                    value={comment}
                    onChange={handleCommentChange}
                    className="reviewtext"
                  />
                </div>
                
                  <button id="revieweditbtn" onClick={handleSubmit}>Tallenna</button>
                
                </div>

                    ): (
                      <div>
                <div>
                <div>
                  <strong>Muokkaa arvosteluasi:</strong><br />
                  {[1, 2, 3, 4, 5].map((star, index) => (
                    <span
                      key={index}
                      style={{ cursor: 'pointer', color: star <= userEditRating ? '#ff9100' : 'gray' }}
                      onClick={() => handleEditRatingChange(star)}
                    >
                      &#9733;
                    </span>
                  ))}
                  <br></br><input
                  
                    type="checkbox"
                    checked={userEditFavorite}
                    onChange={handleEditCheckboxChange}
                  /> Lisää suosikkeihin.
                </div>
                <div style={{ marginTop: '10px' }}>
                  <textarea
                    placeholder="Leave a comment..."
                    value={Editcomment}
                    onChange={handleEditCommentChange}
                    className="reviewtext"
                  /><br/>
                  <button id="revieweditbtn" onClick={updateReview}>Tallenna</button>
                  <button id="reviewedelbtn" onClick={deleteReview}>Poista</button>
                </div>                
                </div>                       
              </div>
                     )}
                </div>
              ) : (
                <p></p>
              )}
              {Array.isArray(recipeReviews) ? (  
              <div className="reviews">
                  <p id="reviewtitle">Arvostelut:</p>
                {recipeReviews.map((review) => (
                  <div className="review-box" key={review.reviewid} >
                    <div className="review-name">
                    <label>{review.username}<br/></label>
                    
                    {[1, 2, 3, 4, 5].map((star, index) => (
                    <span
                      id="stars"
                      key={index}
                      style={{ color: star <= review.rating ? '#ff9100' : 'gray' }}
                    >
                      &#9733;
                    </span>
                  ))}
                    </div>
                    <div className="review-comment">
                    <p>{review.review}</p>
                    </div>
                  </div>
                ))}      
              </div>):(
                 <div className="reviews">
                 <p id="reviewtitle">Arvostelut:</p>
               
             </div>
              )}
               

      </div>


    )
}

export {RatingComponent};

