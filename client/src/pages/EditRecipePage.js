import React, { useState, useEffect } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate, useParams } from 'react-router-dom';
const EditRecipePage = () => {
  //ContextApi for current user
  const {user} = useAuthContext();
  const navigate = useNavigate();
  const { id } = useParams();
  //Muuttuja
  const [imagePreview, setImagePreview] = useState(null);
  const [RecipeCategory, setRecipeCategory] = useState(null);
  const [IngAmount, setIngAmount] = useState('');
  const [IngMeasure, setIngMeasure] = useState('ml');
  const [IngName, setIngName] = useState('');
  const [RecipeName, setRecipeName] = useState('');
  const [Ingredients, setIngredients] = useState([]); 
  const [updatedIngredients, setUpdatededIngredients] = useState([]); 
  const [ingredientsPlaceholder, setIngredientsPlaceholder] = useState([]); 
  const [RecipeDesc, setRecipeDesc] = useState('');
  const [RecipeGuide, setRecipeGuide] = useState('');
  const [Tags, setTags] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [userHasAccess, setUserHasAccess] = useState(false);
  const [ingAmountArray ,setIngAmountArray] = useState([])
  const [ingNameArray, setIngNameArray] = useState([]);
  const [ingMeasureArray ,setIngMeasureArray] = useState([]);
  const [missingFieldsMessage, setMissingFieldsMessage] = useState('');
  const [RecipeReg, setRecipeReg] = useState();
  const [tooLargeImage, setTooLargeImage] = useState('');
  //Vaihtoehdot kategorialle ja ainesosan mitalle
  const Kategoria = ['Alkupala', 'Juoma', 'Välipala', 'Pääruoka', 'Jälkiruoka', 'Leivonnaiset', 'Muu'];
  const options = ['ml', 'tl', 'rkl', 'dl', 'l', 'kkp' ,'g', 'kg', 'kpl'];
  /*Mitat:
  Tilavuus:
  ml = millilitra 1ml
  tl = teelusikka 5ml
  rkl = ruokalusikka 15ml
  dl= desilitra 100ml 
  kkp = kahvikuppi 150ml / 1,5 dl
  l = litra = 1000 ml / 10 dl
  Paino:
  g = gramma 1g
  kg = kilogramma 1000g
  Muut:
  kpl = kappale
  */
  //Kuva tiedoston muuttuminen
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64Data = await readFileAsBase64(file);
        setSelectedFile(base64Data);
        setImagePreview(URL.createObjectURL(file)); 
      } catch (error) {
        console.error('Error reading file as base64:', error);
      }
    }
  };
  //Kuvaan liittyvä.
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
//Kuvaan liittyvä.
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };
  


  //use state changerit
  const CategoryChange = (option) => {
    setRecipeCategory(option);
  };

  const IngAmountChange = (event) => {
    const input = event.target.value.replace(/[^0-9]/g, '');
    setIngAmount(input);
  };

  const IngMeasureChange = (event) => {
    setIngMeasure(event.target.value);
  };

  const IngNameChange = (event) => {
    setIngName(event.target.value);
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
  const IngAmountChangeArray = (event, index) => {
    const input = event.target.value.replace(/[^0-9]/g, '');
    const newAmounts = [...ingAmountArray];
    newAmounts[index] = input;
    setIngAmountArray(newAmounts);
  };
  const IngNameChangeArray = (event, index) => {
    const newNames = [...ingNameArray];
    newNames[index] = event.target.value;
    setIngNameArray(newNames);
  };
  const IngMeasureChangeArray = (event, index) => {
    const newMeasures = [...ingMeasureArray];
    newMeasures[index] = event.target.value;
    setIngMeasureArray(newMeasures);
  };


  const handleCheckboxChange = () => {
    setRecipeReg(RecipeReg === 0 ? 1 : 0);
    
  };

  //Ainesosan lisääminen Varmistaa että inputit eivät ole tyhjiä
  const addIngredient = async (e) => {
    if (IngAmount) {
      if (IngName){
      setIngredients([...Ingredients, { IngAmount, IngMeasure, IngName }]);
      setIngAmount('');
      setIngMeasure('ml');
      setIngName('');
    } else{
      e.preventDefault();
      alert('Ainesosan nimi puuttuu');
    }
    } else {
      e.preventDefault();
      alert('Ainesosan määrä puuttuu');
    }
  };
  //Ainesosan muokkaaminen
  const editIngredients = () => {
      const combinedArray = ingredientsPlaceholder.map((ingredient, index) => ({
      ingredientid: ingredient.ingredientid,
      recipeid: ingredient.recipeid,
      IngAmount: ingAmountArray[index] || '',
      IngMeasure: ingMeasureArray[index] || '',
      IngName: ingNameArray[index] || '',
    }));
    if(checkFields(combinedArray)){
    setMissingFieldsMessage('');
    setUpdatededIngredients(combinedArray)
    }
    else {
      setMissingFieldsMessage('Täytä kaikki kentät ennen tallentamista');
    }
  }


  const checkFields = (arrayOfObjects) => {
    return arrayOfObjects.every(obj => Object.values(obj).every(value => value !== ''));
  };


  //Tallentaa reseptin muokkaukset tietokantaan.
  //Varmistaa että kentät eivät ole tyhjiä
  const editBtnClick = async () => {
    if (RecipeName) {
      if (RecipeCategory){
          if(RecipeGuide){
            const UserID = `${user.userid}`
            try {
              if(!user) {
                throw Error('Sinun täytyy kirjautuu sisään jotta voit luoda uusia reseptejä.')
             }
              const response = await fetch('http://localhost:3001/api/recipe/edit', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                  id,
                  UserID,
                  RecipeName,
                  RecipeCategory,
                  RecipeGuide,
                  RecipeDesc,
                  Tags,
                  updatedIngredients,
                  Ingredients,
                  RecipeReg,
                  selectedFile
                }),
              });
        
              if (response.ok) {
                setTooLargeImage('');
                console.log('Recipe edited successfully');
                window.alert('Resepti muokattu.')
                navigate('/ProfilePage')
              } else {
                if(response.stats === 413)
                console.error('Failed to edit recipe:', response.statusText);
                setTooLargeImage('Kuva on liian iso tai väärä tiedosto tyyppiä.');
              }
            } catch (error) {
              console.error('Error:', error.message);
            }

          } else{
            alert('Reseptin ohje puuttuu');
          }
      } else {
        alert('Reseptin kategoria puuttuu!')
      }
    } else {
      alert('Reseptin nimi puuttuu!');
    }
  };

  //Hakee reseptin tietokannasta id:een perusteella.
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
        setRecipe(data.data.recipes[0]);
        setRecipeName(data.data.recipes[0].recipename)
        setRecipeGuide(data.data.recipes[0].instructions)
        setRecipeDesc(data.data.recipes[0].description)
        setTags(data.data.recipes[0].tags)
        setRecipeReg(data.data.recipes[0].regonly)
        setUserHasAccess(user.userid === data.data.recipes[0].userid);
        setRecipeCategory(data.data.recipes[0].category);
        if(data.data.recipes[0].images !== null) {
          const base64Image = arrayBufferToBase64(data.data.recipes[0].images.data);
          setSelectedFile(base64Image);
        }
      } catch (error) {
        console.error('Error during search:', error.message);
      }
    }
    getRecipe();
    getIngredients();
  }, [/*id, user*/]);

//lähettää uuden ainesosat.
const sendIngredients = async () => {
            try {
              const response = await fetch(`http://localhost:3001/api/ingredients/add`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                  Ingredients,
                  id
                }),
              });
              
              const data = await response.json();
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
            } catch (error) {
              console.error('Error during search:', error.message);
            }
}
useEffect(() => {
  if(Ingredients.length === 0){
    return;
    
  } 

  sendIngredients();
},[Ingredients])


//Hakee reseptin ainesosat.
          const getIngredients = async () => {
            try {
              const response = await fetch(`http://localhost:3001/api/ingredients/${id}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`
                },
              });
              const data = await response.json();
              if (!response.ok) {
                throw new Error(data.error);
              }
              const newIngAmountArray = [];
              const newIngNameArray = [];
              const newIngMeasureArray = [];
              for(let i = 0;i < data.data.ingredients.length; i++)
              {
                newIngAmountArray.push(data.data.ingredients[i].quantity);
                newIngNameArray.push(data.data.ingredients[i].ingredientname);
                newIngMeasureArray.push(data.data.ingredients[i].measure);
              }
              setIngAmountArray(newIngAmountArray);
              setIngNameArray(newIngNameArray);
              setIngMeasureArray(newIngMeasureArray);
              setIngredientsPlaceholder(data.data.ingredients);
            } catch (error) {
              console.error('Error during search:', error.message);
            }
          }
//Reseptin ainesosan poistaminen
          const deleteIngredient = async (ingredientId) => {
            try {
                const response = await fetch(`http://localhost:3001/api/ingredients/${ingredientId}`, {
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
                    console.log('Ingredient deleted:' + response.message);
                }
              } catch (error) {
                console.error('Error deleting ingredient:', error.message);
              }
        }
        const deleteImage = async () => {
          try {
              const response = await fetch(`http://localhost:3001/api/recipe/image/${recipe.recipeid}`, {
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
                  console.log('Image deleted:' + response.message);
              }
            } catch (error) {
              console.error('Error deleting image:', error.message);
            }
      }
//Kuvan poistaminen
const handleDeleteImageButtonClick = (e) => {
  if(selectedFile !== null) {
  deleteImage();
  }
  else {
    e.preventDefault();
  }
}
        

  return (
    <div>
    {userHasAccess ? (

    <div className="component-background">
      <h1>Muokkaa reseptiä</h1>
      <form>
      <div className="newrecipe">

    
      <div className="recipehalf">
      <label>Reseptin nimi:<br></br></label>
      <input type="text" className='recipe-input' value={RecipeName} onChange={RecipeNameChange} />
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
  <table>
    <thead>
      <tr>
        <th>Määrä</th>
        <th>Mitta</th>
        <th>Ainesosa</th>
        <th>Toiminto</th>
      </tr>
    </thead>
  <tbody>
      {ingredientsPlaceholder.map((ingredient, index) => (
        <tr key={index}>
          <td>
            <input className='recipe-input' type="text" value={ingAmountArray[index] || ''} onChange={(event) => IngAmountChangeArray(event, index)} />
          </td>
          <td>
          {/* <select value={ingMeasureArray[index] || ''} onChange={(event) => IngMeasureChangeArray(event, index)}>
            <option value="" disabled selected>{ingredientsPlaceholder[index].measure}</option>
              {options.map((option, index) => (
                <option key={index} value={option} selected={option === ingredient.measure} >
                  {option} 
                </option>
              ))}
            </select> */}
            <select className='recipe-input' value={ingMeasureArray[index] || ''} onChange={(event) => IngMeasureChangeArray(event, index)}>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option} 
                </option> 
              ))}
            </select>
          </td>
          <td>
            <input className='recipe-input' type="text" value={ingNameArray[index] || ''} onChange={(event) => IngNameChangeArray(event, index)} />
          </td>
          <td>
            <button className='ingredient-delete-button' onClick={() => {deleteIngredient(ingredientsPlaceholder[index].ingredientid)}}>Poista</button>
          </td>
         </tr>
      ))}
      <tr>
        <td>
         <button type="button" className='ingredient-save-button' onClick={editIngredients}>Tallenna muutokset</button> {missingFieldsMessage && <div style={{ color: 'red' }}>{missingFieldsMessage}</div>}
        </td>
      </tr>
      <tr>
        <td>
          <input type="text" className='recipe-input' value={IngAmount} onChange={IngAmountChange} />
        </td>
        <td>
          <select className='recipe-input' value={IngMeasure} onChange={IngMeasureChange}>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
        </td>
        <td>
          <input type="text" className='recipe-input' value={IngName} onChange={IngNameChange} />
        </td>
        <td>
          <button className='ingredient-add-button' type="submit" onClick={(e) => addIngredient(e)}>
          Lisää
          </button>
        </td>
      </tr>
      </tbody>
      </table>  
</div>
       <label>Reseptin kuvaus:</label>
       <textarea className='recipe-input' type="text" value={RecipeDesc} onChange={RecipeDescChange} style={{height: '80px'}}></textarea>
       
       <div>
       <label>tags:</label>
       <textarea className='recipe-input' type="text" value={Tags} onChange={TagsChange} style={{height: '80px'}}></textarea>
       </div>
</div>
<div className="recipehalf">
  <div className="recipehalf2">
     <div>
      <label>Reseptin kuva: <br></br></label>
        <input  type="file" accept=".jpg, .jpeg, .png" onChange={handleFileChange}/><button onClick={(e) => handleDeleteImageButtonClick(e)}>Poista kuva</button>
      <br></br>
      {imagePreview ?         
        
          <img src={imagePreview} alt="Recipe Image" style={{ maxWidth: '300px',  maxHeight: '270px' }} />
        : <img src={`data:image/jpeg;base64,${selectedFile}`} alt="Recipe Image" style={{ maxWidth: '300px',  maxHeight: '270px' }} />}
      <p style={{color:'red'}}>{tooLargeImage}</p>
      </div>
      <div className="recipeGuideContainer">
        <label>Reseptin ohje:</label>
      
        <textarea className='recipe-input' type="text" value={RecipeGuide} onChange={RecipeGuideChange} style={{height: '300px'}}></textarea>
      </div>
    
       </div>
</div>
      <button id="newrecipesavebtn" type="button" onClick={editBtnClick}>
        Tallenna muokkaus
      </button>
</div>
</form>
</div>


    ) : (         <div>
        <h1>Loading...</h1>
      </div> )}
      </div>
  );
};

export {EditRecipePage}