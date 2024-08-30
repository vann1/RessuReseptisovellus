import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from "../hooks/useAuthContext";

function Recipe() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [userHasAccess, setUserHasAccess] = useState(false);
  const [formData, setFormData] = useState({
    recipeid: '',
    recipename: '',
    category: '',
    instructions: '',
    description: '',
    tags: '',
    // Tähän voit lisätä muita reseptin kenttiä, kuten ainesosat jne.
  });
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/recipe/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setRecipe(data.data.recipes.recordset[0]);
        setUserHasAccess(user.userid === data.data.recipes.recordset[0].userid);
        setFormData({
          recipeid: data.data.recipes.recordset[0].recipeid,
          recipename: data.data.recipes.recordset[0].recipename,
          category: data.data.recipes.recordset[0].category,
          instructions: data.data.recipes.recordset[0].instructions,
          description: data.data.recipes.recordset[0].description,
          tags: data.data.recipes.recordset[0].tags,
        });
      } catch (error) {
        console.error('Error during search:', error.message);
      }
    }
    getRecipe();
  }, [id, user]);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/recipe/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        console.log(response)
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      navigate('/ProfilePage');
    } catch (error) {
      console.error('Error during update:', error.message);
    }
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {userHasAccess ? (
        <div>
          <h1>Edit Recipe</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Reseptin id:</label>
              <input type="text" name="recipeid" value={formData.recipeid} onChange={handleInputChange} />
            </div>
            <div>
              <label>Reseptin nimi:</label>
              <input type="text" name="recipename" value={formData.recipename} onChange={handleInputChange} />
            </div>
            <div>
              <label>Reseptin kategoria:</label>
              <input type="text" name="category" value={formData.category} onChange={handleInputChange} />
            </div>
            <div>
              <label>Reseptin ohjeet:</label>
              <input type="text" name="instructions" value={formData.instructions} onChange={handleInputChange} />
            </div>
            <div>
              <label>Reseptin kuvaus:</label>
              <input type="text" name="description" value={formData.description} onChange={handleInputChange} />
            </div>
            <div>
              <label>Reseptin tagit:</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} />
            </div>
            <button type="submit">Save Changes</button>
          </form>
        </div>
      ) : (
        <div>
          <h1>No Access</h1>
          <p>You do not have permission to edit this recipe.</p>
        </div>
      )}
    </div>
  );
}

export {Recipe};