import React, { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css'

const RuokaKategoria = () => {
  const {user} = useAuthContext();
  const navigate = useNavigate();
  //Muuttujat
  const [RecipeCategory, setRecipeCategory] = useState(null);
  const [IngAmount, setIngAmount] = useState('');
  const [IngMeasure, setIngMeasure] = useState('ml');
  const [IngName, setIngName] = useState('');
  const [RecipeName, setRecipeName] = useState('');
  const [Ingredients, setIngredients] = useState([]); 
  const [RecipeDesc, setRecipeDesc] = useState('');
  const [RecipeGuide, setRecipeGuide] = useState('');
  const [Tags, setTags] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  //Vaihtoehdot kategorialle ja ainesosan mitalle
  const Kategoria = ['Alkupala', 'Juoma', 'Välipala', 'Pääruoka', 'Jälkiruoka', 'Leivonnaiset', 'Muu'];
   const options = ['ml', 'tl', 'rkl', 'dl', 'l', 'kkp' ,'g', 'kg', 'kpl'];
  const [RecipeReg, setRecipeReg] = useState(0);
  const [image, setImage] = useState(null);
  const [pElement, setPElement] = useState('');

  //Kuvan lisäys funktio
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
      try {
        const base64Data = await readFileAsBase64(file);
        setSelectedFile(base64Data);
      } catch (error) {
        console.error('Error reading file as base64:', error);
      }
    }
  };

  //Rekisteröityneille käyttäjille valinta, 0 kaikille, 1 vain rekisteröityneille
  const handleCheckboxChange = () => {
    setRecipeReg(RecipeReg === 0 ? 1 : 0);
    
  };
  //Lukee kuvan
  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result?.split(',')[1]);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    });
  };
  //use state changerit
  const CategoryChange = (option) => {
    setRecipeCategory(option);
  };

  const RecipeNameChange = (event) => {
    setRecipeName(event.target.value);
  };

  const RecipeDescChange = (event) =>{
    setRecipeDesc(event.target.value);
  };

  const RecipeGuideChange = (event) => {
    setRecipeGuide(event.target.value)
  }

  const TagsChange = (event) => {
    setTags(event.target.value)
  }

  const handleInputChange = (index, field, value) => {
    if(field === "IngAmount"){
      value = value.replace(/[^0-9]/g, '');
    }
    const updatedIngredients = [...Ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setIngredients(updatedIngredients);
  };

const isValidIngredients = () => {
  return Ingredients.every(ingredient => {
    return ingredient.IngAmount.trim() !== "" && ingredient.IngName.trim() !== "";
  });
};
  //Ainesosan lisääminen Varmistaa että inputit eivät ole tyhjiä
  const addIngredient = () => {
      setIngredients([...Ingredients, { IngAmount, IngMeasure, IngName }]);
      setIngAmount('');
      setIngMeasure('ml');
      setIngName('');
  };
  
  //poistaa viimeisimmän ingredientin.
  const deleteLastIngredient = () => {
    const newIngredients = [...Ingredients];
    newIngredients.pop();
    setIngredients(newIngredients);
  };



  //Lähettää uuden reseptin tietokantaan ja ohjaa showrecipe sivulle reseptistä.
  //Varmistaa että kentät eivät ole tyhjiä
  const TallennaBtnClick = async () => {
    if (RecipeName) {
      if (RecipeCategory){
        if(Ingredients.length > 0){
          if (isValidIngredients()){
          if(RecipeGuide){
            const UserID = `${user.userid}`
            try {
              if(!user) {
                throw Error('Sinun täytyy kirjautuu sisään jotta voit luoda uusia reseptejä.')
             }
              const response = await fetch('http://localhost:3001/api/recipe/add', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                  UserID,
                  RecipeName,
                  RecipeCategory,
                  RecipeGuide,
                  RecipeDesc,
                  Tags,
                  Ingredients,
                  selectedFile,
                  RecipeReg,
                }),
              });
              const data = await response.json();
              const recipeid = data.data.recipeID;
              if (response.ok) {
                console.log('Recipe added successfully');
                navigate(`/Recipe/${recipeid}`)
              } else {
                console.error('Failed to add recipe:', response.statusText);
              }
              
            } catch (error) {
              setPElement('Kuva on liian iso tai väärä tiedosto tyyppiä.')
              console.error('Error:', error.message);
            }

          } else{
            alert('Reseptin ohje puuttuu');
          }
          } else{
            alert('Täytä ainesosat.')
          }
        } else {
          alert('Reseptillä pitää olla vähintään 1 ainesosa.');
        }
      } else {
        alert('Reseptin kategoria puuttuu!')
      }
    } else {
      alert('Reseptin nimi puuttuu!');
    }
  };

  return (
    <div className="component-background">
      <h1>Lisää uusi resepti</h1>
   
    <form>
       <div className="newrecipe">
      <div className="recipehalf">
      <label>Reseptin nimi: <br></br></label>
      <input className='recipe-input' type="text" value={RecipeName} onChange={RecipeNameChange} style={{width: '100%'}}/>
      <br></br>
      <label>Reseptin kategoria:</label>
<div className="category-grid">
  {Kategoria.map((option, index) => (
    <div id="RuokaKategoria" key={index}>
      <input
        type="checkbox"
        id={`checkbox-${index}`}
        value={option}
        checked={RecipeCategory === option}
        onChange={() => CategoryChange(option)}
      />
      <label htmlFor={`checkbox-${index}`}>{option}</label>
    </div>
  ))}
</div>
      
      <label >
        
        Vain rekisteröityneille käyttäjille?<br></br><input
          type="checkbox"
          checked={RecipeReg}
          onChange={handleCheckboxChange}
        /> Kyllä
      </label>
     <p>Ainesosat:</p>
<div className="ingredientlist">
   <div className="newingredient">
<table>
  <thead>
    <tr>
      <th>Määrä</th>
      <th>Mitta</th>
      <th>Ainesosa</th>
    </tr>
  </thead>
  <tbody>
    {Ingredients.map((ingredient, index) => (
      <tr key={index}>
        <td>
          <input
            className='recipe-input'
            type="number"
            min="0"
            inputMode="numeric"
            value={ingredient.IngAmount}
            onChange={(e) => handleInputChange(index, 'IngAmount', e.target.value)}
            pattern="[0-9]*"
          />
        </td>
        <td>
          <select
            value={ingredient.IngMeasure}
            className='recipe-input'
            onChange={(e) => handleInputChange(index, 'IngMeasure', e.target.value)}
          >
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </td>
        <td>
          <input
            className='recipe-input'
            type="text"
            value={ingredient.IngName}
            onChange={(e) => handleInputChange(index, 'IngName', e.target.value)}
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>
  <button className='recipebutton' type="button" onClick={addIngredient}>Lisää Ainesosa</button>
  <button className='recipebutton recipebutton-delete'  type="button" onClick={deleteLastIngredient}>Poista ainesosa</button>
</div>

</div>
        
      <div>
       <label>Reseptin kuvaus:<br></br></label>
       <textarea className='recipe-input' type="text" value={RecipeDesc} onChange={RecipeDescChange} style={{height: '80px'}}></textarea>
       </div>
       <div>
       <label>tags:</label>
       <textarea className='recipe-input' type="text" value={Tags} onChange={TagsChange}style={{height: '60px'}}></textarea>
       </div>

      </div>

      <div className="recipehalf">
        <div className="recipehalf2">
  
  <div>
    <label>Reseptin kuva:<br/></label>
    <input type="file" accept=".jpg, .jpeg, .png" onChange={handleFileChange} />
    <br></br>
    {image ? (
      <img src={image} alt="Uploaded" style={{width: '300px', maxHeight: '270px'}}/>
    ) : (
      <p>Kuva tulee tähän</p>
    )}
    <p style={{color:'red'}}>{pElement}</p>
  </div>
  <div className="recipeGuideContainer">
    <label>Reseptin ohje:</label>
    <textarea className='recipe-input' type="text" value={RecipeGuide} onChange={RecipeGuideChange} style={{height: '300px'}}></textarea>
  </div>
</div>
</div>


      <button id="newrecipesavebtn" type="button" onClick={TallennaBtnClick}>
        Tallenna
      </button>
      </div>
    </form>

</div>
  );
};

export default RuokaKategoria;