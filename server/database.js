const { validateUser } = require("./utils/userUtils");
const {} = require("./utils/responseUtils");
const sql = require("mssql");
const config = require("./config/config");
const bcrypt = require("bcrypt"); // for password encrypting

let pool;
//Connect to database
const connectToDatabase = async () => {
  try {
    pool = await sql.connect(config);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};
//Sulkee yhteyden tietokantaan.
const closeDatabaseConnection = async () => {
  try {
    await pool.close();
  } catch (error) {
    console.error("Error closing database connection:", error);
  }
};


/**
 * Adds a user to the database.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {boolean} Returns true if the user is successfully added to the database, otherwise false.
 */
//add user to database
const addUserToDatabase = async (req, res) => {
  //First it gets user details from req.body
  const { username, email, password, name } = req.body;
  //Checks if those user details were in correct format
  if (!validateUser(username, email, password, name)) {
    return false;
  }
  const existingUser = await getUserFromDatabase(req, res);
  //Checks if user already exists in the database
  if (existingUser !== undefined) {
    return false;
  }
  try {
    //creates connection to database
    await connectToDatabase();

    //initializes a new request object that is used to send SQL queries to the connected database using the sql module or library.
    const request = pool.request();

    //encrypts password for database
    const hashedPassword = await bcrypt.hash(password, 10);
    //query for database
    const query = `
            INSERT INTO [dbo].[users] (username, email, password, name)
            VALUES (@username, @email, @password, @name)
        `;
    //database request
    await request
      .input("username", sql.NVarChar, username)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, hashedPassword)
      .input("name", sql.NVarChar, name)
      .query(query);

    return true;
  } catch (error) {
    console.error("Error adding user to the database:", error);
    return false;
  }
  finally {
    await closeDatabaseConnection();
    } 
};

/**
 * Retrieves a user from the database based on the provided email.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object|undefined} Returns the user object if found, otherwise returns undefined.
 */
//gets user from database
const getUserFromDatabase = async (req, res) => {
  //takes email from req.body
  const { email, userId } = req.body;

  try {
    //creates connection to database
    await connectToDatabase();


    //initializes a new request object that is used to send SQL queries to the connected database using the sql module or library.
    const request = pool.request();
    let query;
    let input;

    //query for database
    if(email) {
      query = `SELECT * FROM users WHERE email = @email`;
      input ='email';
    } else if (userId) {
      query = `SELECT * FROM users WHERE userid = @userId`;
      input ='userId';
    } else {
      return undefined;
    }
  
    //make database request for email
    const result = await request
      .input(input, sql.NVarChar, email || userId)
      .query(query);
    //checks if the user existed in the database
    if (result.recordset.length > 0) {
      //returns that user
      const user = result.recordset[0];
      return user;
    }
    //else returns undefined, which means user didnt exist in the database
    return undefined;
  } catch (error) {
    console.error("Error getting user from the database:", error);
  }
  finally {
    await closeDatabaseConnection();
    } 
};

//adds recipe to database
const addRecipeToDatabase = async (req, res) => {
  const { UserID, RecipeName, RecipeCategory, RecipeGuide, RecipeDesc, Tags, Ingredients, selectedFile, RecipeReg } = req.body;
  let connection;
  try {
    connection = await sql.connect(config);
    const transaction = new sql.Transaction(connection);

    try {
      await transaction.begin();
      // Insert into recipes table
      const recipeQuery = `
      INSERT INTO [dbo].[recipes] (userid, recipename, category, instructions, description, tags, regonly${selectedFile ? ', images' : ''})
      VALUES (@Userid, @RecipeName, @RecipeCategory, @RecipeGuide, @RecipeDesc, @Tags, @RecipeReg${selectedFile ? ', @selectedFile' : ''});
      SELECT SCOPE_IDENTITY() AS RecipeID; -- Retrieve the newly inserted recipe ID
    `;
      const recipeResult = await new sql.Request(transaction)
      .input('Userid', sql.NVarChar, UserID)
      .input('RecipeName', sql.NVarChar, RecipeName)
      .input('RecipeCategory', sql.NVarChar, RecipeCategory)
      .input('RecipeGuide', sql.NVarChar, RecipeGuide)
      .input('RecipeDesc', sql.NVarChar, RecipeDesc)
      .input('Tags', sql.NVarChar, Tags)
      .input('RecipeReg', sql.Int, RecipeReg)
      .input('selectedFile', sql.VarBinary, selectedFile ? Buffer.from(selectedFile, 'base64') : null)
      .query(recipeQuery);
      const recipeID = recipeResult.recordset[0].RecipeID;
      // Insert into ingredients table for each ingredient
      const ingredientQuery = `
        INSERT INTO [dbo].[ingredients] (recipeid, quantity, measure, ingredientname)
        VALUES (@RecipeID, @Quantity, @Measure, @IngredientName);
      `;
      for (let i = 0; i < Ingredients.length; i++) {
        const ingredient = Ingredients[i];
        await new sql.Request(transaction)
          .input('RecipeID', sql.Int, recipeID)
          .input('Quantity', sql.NVarChar, ingredient.IngAmount)
          .input('Measure', sql.NVarChar, ingredient.IngMeasure)
          .input('IngredientName', sql.NVarChar, ingredient.IngName)
          .query(ingredientQuery);
      }
      await transaction.commit();
      return recipeID;
    } catch (error) {
      await transaction.rollback();
      console.error('Error adding recipe to the database:', error);
      return false;
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false;
  }
  finally {
    if (connection) {
      connection.close();
    }
  } 
}; 
  
/********************************************************* */
//searches recipes from database
const getRecipeFromDatabase = async (req, res) => {
  // Assuming your database connection is already established and stored in the 'sql' variable
  const recipeidparams = req.params.id;
  //userid for getting recipe for certain user
  const userid = req.params.userId;
  // Destructure parameters from the request body
  const { recipeName, recipeCategory, recipeTag, recipeUsername, recipeOwnerName, recipeid, ingredientName } = req.body;

  try {
    await connectToDatabase();

    // Initialize a new request object
    const request = pool.request();

    // Build the query based on the provided parameters
    let query = 'SELECT recipes.*, users.username, users.name FROM recipes INNER JOIN users ON recipes.userid = users.userid'; // Start with a true condition

    if(ingredientName) {
      query += ' INNER JOIN ingredients ON recipes.recipeid = ingredients.recipeid';
    }

    query += ' WHERE 1=1';

    if (recipeName) {
      query += ' AND recipes.recipename LIKE @recipeName';
      request.input('recipeName', sql.NVarChar, `%${recipeName}%`);
    }
    
    if (recipeid) {
      query += ' AND recipes.recipeid LIKE @recipeid';
      request.input('recipeid', sql.NVarChar, `%${recipeid}%`);
    }

    if (recipeCategory) {
      query += ' AND recipes.category LIKE @recipeCategory';
      request.input('recipeCategory', sql.NVarChar, `%${recipeCategory}%`);
    }

    if (recipeTag) {
      query += ' AND recipes.tags LIKE @recipeTag';
      request.input('recipeTag', sql.NVarChar, `%${recipeTag}%`);
    }
 
    if (recipeUsername) {
      query += ' AND users.username LIKE @recipeUsername';
      request.input('recipeUsername', sql.NVarChar, `%${recipeUsername}%`);
    }

    if (recipeOwnerName) {
      query += ' AND users.name LIKE @recipeOwnerName';
      request.input('recipeOwnerName', sql.NVarChar, `%${recipeOwnerName}%`);
    }
    
    if (userid) {
      query +=
        ' AND users.userid = @userid';
      request.input('userid', sql.Int, userid);
    }

    if (recipeidparams) {
      query += ' AND recipeid LIKE @recipeid';
      request.input('recipeid', sql.NVarChar, `%${recipeidparams}%`);
    }
    if (ingredientName) {
      query += ' AND ingredients.ingredientname LIKE @ingredient';
      request.input('ingredient', sql.NVarChar, `%${ingredientName}%`);
    }
    // Execute the query
    const result = await request.query(query);

    if (result.recordset.length > 0) {
      // Return the first record if any
      const recipes = result.recordset;
      return recipes;
    } else {
      return undefined;
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    return undefined;
  }     finally {
    await closeDatabaseConnection();
    } 
};

//searches all users from database
const getAllUsersFromDatabase = async (req, res) => {
  try {
    await connectToDatabase();

    const request = pool.request();

    const query = `SELECT * FROM users`;

    const result = await request.query(query);
 
    if (result.recordset.length > 0) {
      const users = result.recordset;
      return users;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error getting users from the database:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  finally {
    await closeDatabaseConnection();
    } 
};

//deletes user and users reviews from database
const deleteUserFromDatabase = async (userid)  => {
  try {
    await connectToDatabase();
    const request = pool.request();
    const query = `DELETE FROM [dbo].[reviews] WHERE userid = @userid;
                    DELETE FROM users WHERE userid = @userid`;

    const result = await request
      .input("userid", sql.NVarChar, userid)
      .query(query);
    return result;
  } catch (error) {
    console.error("Error deleting user from the database:", error);
    throw error;
  }
  finally {
    await closeDatabaseConnection();
    } 
};

//edits recipe in database
const editRecipeToDatabase = async (req,res) => {

  const { id, RecipeName, RecipeCategory, RecipeGuide, RecipeDesc, Tags, updatedIngredients, Ingredients, RecipeReg, selectedFile} = req.body;
  let connection;
  try {
    connection = await sql.connect(config);
    const transaction = new sql.Transaction(connection);

    try {
      await transaction.begin();
      const recipeUpdateQuery = `
      UPDATE [dbo].[recipes]
      SET recipename = @RecipeName,
          category = @RecipeCategory,
          instructions = @RecipeGuide,
          description = @RecipeDesc,
          tags = @Tags,
          regonly = @RecipeReg,
          images = @selectedFile
          WHERE recipeid = @RecipeID;
    `;
  await new sql.Request(transaction)
  .input('RecipeName', sql.NVarChar, RecipeName)
  .input('RecipeCategory', sql.NVarChar, RecipeCategory)
  .input('RecipeGuide', sql.NVarChar, RecipeGuide)
  .input('RecipeDesc', sql.NVarChar, RecipeDesc)
  .input('Tags', sql.NVarChar, Tags)
  .input('RecipeReg', sql.Int, RecipeReg)
  .input('RecipeID', sql.Int, id)
  .input('selectedFile', sql.VarBinary, selectedFile ? Buffer.from(selectedFile, 'base64') : null)
  .query(recipeUpdateQuery);

  const ingredientQuery = `
  UPDATE [dbo].[ingredients]
  SET quantity = @Quantity, measure = @Measure, ingredientname = @IngredientName
  WHERE recipeid = @RecipeID AND ingredientid = @IngredientID;
`;
for (let i = 0; i < updatedIngredients.length; i++) {
  const ingredient = updatedIngredients[i];
  await new sql.Request(transaction)
    .input('RecipeID', sql.Int, ingredient.recipeid)
    .input('Quantity', sql.Int, ingredient.IngAmount)
    .input('Measure', sql.NVarChar, ingredient.IngMeasure)
    .input('IngredientName', sql.NVarChar, ingredient.IngName)
    .input('IngredientID', sql.Int, ingredient.ingredientid)
    .query(ingredientQuery);
}

      await transaction.commit();
      return true; 
    } catch (error) {
      await transaction.rollback();
      console.error('Error updating recipe:', error);
      return false; 
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false; 
  } finally {
    if (connection) {
      connection.close();
    }
  } 
  }
  
//Gets ingredients from database
//gets all ingredients from database
const getIngredientsFromDatabase = async (req,res) => {
  const recipeid = req.params.recipeId;
  try {
    //creates connection to database
    await connectToDatabase();

    //initializes a new request object that is used to send SQL queries to the connected database using the sql module or library.
    const request = pool.request();


    //query for database
    const query = `SELECT * FROM ingredients WHERE recipeid = @recipeId`;
    const result = await request
      .input("recipeId", sql.Int, recipeid)
      .query(query);
    if (result.recordset.length > 0) {
      const ingredients = result.recordset;
      return ingredients;
    }
    return undefined;
  } catch (error) {
    console.error("Error getting ingredients from the database:", error);
  }  
  finally {
    await closeDatabaseConnection();
  }
}


//adds ingredient to database
const addIngredientToDatabase = async (req, res) => {
  const {Ingredients, id} = req.body;
  let connection;
  try {
    connection = await sql.connect(config);
    const transaction = new sql.Transaction(connection);

    try {
      await transaction.begin();
      const ingredientQuery = `
        INSERT INTO [dbo].[ingredients] (recipeid, quantity, measure, ingredientname)
        VALUES (@RecipeID, @Quantity, @Measure, @IngredientName);
      `;
        await new sql.Request(transaction)
          .input('RecipeID', sql.Int, id)
          .input('Quantity', sql.NVarChar, Ingredients[0].IngAmount)
          .input('Measure', sql.NVarChar, Ingredients[0].IngMeasure)
          .input('IngredientName', sql.NVarChar, Ingredients[0].IngName)
          .query(ingredientQuery);

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      console.error('Error adding ingredient to the database:', error);
      return false;
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false;
  }  finally {
    if (connection) {
      connection.close();
    }
  } 
}; 

//removes ingredient from database
const deleteIngredientFromDatabase = async (req, res) => {
  const { ingredientId } = req.params; 
  let connection;
  try {
    connection = await sql.connect(config);
    const transaction = new sql.Transaction(connection);
    try {
      await transaction.begin();
      const deleteQuery = `
        DELETE FROM [dbo].[ingredients] WHERE ingredientid = @IngredientID;
      `;
      await new sql.Request(transaction)
        .input('IngredientID', sql.Int, ingredientId)
        .query(deleteQuery);
      
      await transaction.commit();
      return true; 
    } catch (error) {
      await transaction.rollback();
      console.error('Error deleting ingredient from database:', error);
      return false; 
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false; 
  }
  finally {
    if (connection) {
      connection.close();
    }
  } 
}

//deletes recipe from database
const deleteRecipeFromDatabase = async (req, res) => {
  const { recipeId } = req.params; 
  let connection;
  try {
    connection = await sql.connect(config);
    const transaction = new sql.Transaction(connection);
    try {
      await transaction.begin();
      const deleteQuery = `
        DELETE FROM [dbo].[recipes] WHERE recipeid = @RecipeId;
      `;
      await new sql.Request(transaction)
        .input('RecipeId', sql.Int, recipeId)
        .query(deleteQuery);
      
      await transaction.commit();
      return true; 
    } catch (error) {
      await transaction.rollback();
      console.error('Error deleting recipe from database:', error);
      return false; 
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false; 
  }
  finally {
    if (connection) {
      connection.close();
    }
  } 
}
//deletes recipes picture from database
const deleteRecipeImageFromDatabase = async (req, res) => {
  const { recipeId } = req.params; 
  let connection;
  try {
    connection = await sql.connect(config);
    const request = connection.request();
    const deleteQuery = `
      UPDATE [dbo].[recipes] 
      SET images = NULL 
      WHERE recipeid = @RecipeId;
    `;
    const result = await request
      .input('RecipeId', sql.Int, recipeId)
      .query(deleteQuery);
      
    if (result.rowsAffected[0] > 0) {
      return true; // Image deletion successful
    } else {
      return false; // Recipe ID not found or no image associated
    }
  } catch (error) {
    console.error('Error deleting recipe image from database:', error);
    return false; // Error occurred during deletion
  } finally {
    if (connection) {
      connection.close();
    }
  } 
}
 
 //gets reviews from database
const getReviewFromDatabase = async (req, res) => {
  const recipeid = req.params.recipeid;
  const userid = req.params.userid;
  let connection;
  try {
    connection = await sql.connect(config);
    const request = connection.request();
    
    if(recipeid){
    const query = `SELECT r.*, u.name, u.username
    FROM [dbo].[reviews] AS r
    JOIN [dbo].[users] AS u ON r.userid = u.userid
    WHERE r.recipeid = @recipeId`;
    const result = await request
      .input("recipeId", sql.Int, recipeid)
      .query(query);
    if (result.recordset.length > 0) {
      const reviews = result.recordset;
      return reviews;
    } else{
      return 'Ei arvosteluja';
    }
  }
  if(userid){
    const query = `SELECT r.*, u.recipename, u.description, u.category, u.images
    FROM [dbo].[reviews] AS r
    JOIN [dbo].[recipes] AS u ON r.recipeid = u.recipeid
    WHERE r.userid = @userid AND r.favorite = 1`;
    const result = await request
      .input("userid", sql.Int, userid)
      .query(query);
    if (result.recordset.length > 0) {
      const reviews = result.recordset;
      return reviews;
    } else{
      return undefined;
    }
  }
    
  } catch (error) {
    console.error("Error getting reviews from the database:", error);
  }  finally {
    if (connection) {
      connection.close();
    }
  }
};
 
//adds review to database
const addReviewToDatabase = async (req, res) => {
  const {recipeid, userid, rating, comment, favorite} = req.body;
  let connection;
  try {
    connection = await sql.connect(config);
    const transaction = new sql.Transaction(connection);

    try {
      await transaction.begin();
      const reviewQuery = `
        INSERT INTO [dbo].[reviews] (recipeid, userid, favorite, review, rating)
        VALUES (@recipeid, @userid, @favorite, @comment, @rating);
      `;
        await new sql.Request(transaction)
          .input('recipeid', sql.Int, recipeid)
          .input('userid', sql.Int, userid)
          .input('favorite', sql.Int, favorite)
          .input('comment', sql.NVarChar, comment)
          .input('rating', sql.Int, rating)
          .query(reviewQuery);

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      console.error('Error adding review to the database:', error);
      return false;
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false;
  }  finally {
    if (connection) {
      connection.close();
    }
  } 
}; 

//edits review in database
const editReviewInDatabase = async (req, res) => {
  const {recipeid, userid, rating, comment, favorite, reviewid} = req.body;
  let connection;
  try {
    connection = await sql.connect(config);
    const transaction = new sql.Transaction(connection);

    try {
      await transaction.begin();
      const reviewQuery = `
      UPDATE [dbo].[reviews]
      SET recipeid = @recipeid,
          userid = @userid,
          favorite = @favorite,
          review = @comment,
          rating = @rating
          WHERE reviewid = @reviewid;
    `;
        await new sql.Request(transaction)
          .input('recipeid', sql.Int, recipeid)
          .input('userid', sql.Int, userid)
          .input('favorite', sql.Int, favorite)
          .input('comment', sql.NVarChar, comment)
          .input('rating', sql.Int, rating)
          .input('reviewid', sql.Int, reviewid)
          .query(reviewQuery);

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      console.error('Error editing review in database:', error);
      return false;
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false;
  }  finally {
    if (connection) {
      connection.close();
    }
  } 
}; 
//deletes review from database
const deleteReviewInDatabase = async (req, res) => {
  const reviewid = req.params.reviewid;
  let connection;
  try {
    connection = await sql.connect(config);
    const transaction = new sql.Transaction(connection);

    try {
      await transaction.begin();
      const reviewQuery = `DELETE FROM [dbo].[reviews] WHERE reviewid = @reviewid `;
        await new sql.Request(transaction)
          .input('reviewid', sql.Int, reviewid)
          .query(reviewQuery);

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      console.error('Error deleting review from database:', error);
      return false;
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false;
  }  finally {
    if (connection) {
      connection.close();
    }
  } 
}; 
/**
 * Checks if the provided email is registered in the database.
 * @param {string} email - The email to check.
 * @returns {boolean} Returns true if the email is registered, otherwise returns false.
 */
const isEmailRegistered = async (email) => {
  let connection;
  try {
    connection = await sql.connect(config);
    const request = connection.request();

    const query = `
      SELECT COUNT(*) AS count
      FROM [dbo].[users]
      WHERE email = @email
    `;
    const result = await request
      .input("email", sql.NVarChar, email)
      .query(query);

    const count = result.recordset[0].count;
    return count > 0;
  } catch (error) {
    console.error("Error checking if email is registered in the database:", error);
    throw error;
  } finally {
    if (connection) {
      connection.close();
    }
  }
};
/**
 * Adds a new password for the specified user to the database.
 * @param {string} email - The email of the user.
 * @param {string} password - The new password to be added.
 * @returns {boolean} Returns true if the password is successfully added to the database, otherwise false.
 */
const addPasswordToDatabase = async (email, password) => {
  try {
      // Create a connection to the database
      await connectToDatabase();

      // Initialize a new request object to send SQL queries
      const request = pool.request();

      // Encrypt the password for the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Define the SQL query to update the user's password in the database
      const query = `
          UPDATE [dbo].[users]
          SET password = @password
          WHERE email = @email
      `;

      // Execute the database query
      await request
          .input("password", sql.NVarChar, hashedPassword)
          .input("email", sql.NVarChar, email)
          .query(query);

      return true; // Password added successfully
  } catch (error) {
      console.error("Error adding password to the database:", error);
      return false; // Error occurred while adding password
  } finally {
      // Close the database connection
      await closeDatabaseConnection();
  }
}
//gets recipes from database
const searchRecipesFromDatabase = async (req, res) => {
  const { input } = req.body; // Oletetaan, että input sisältää käyttäjän antaman syötteen

  try {
    await connectToDatabase();

    const query = `
    SELECT distinct
    r.description,
    r.images,
    r.recipeid, 
    r.userid, 
    r.recipename, 
    r.category, 
    r.tags,
    u.username, 
    u.email, 
    u.name
FROM 
    [dbo].[recipes] r
LEFT JOIN 
    [dbo].[reviews] rv ON r.recipeid = rv.recipeid
LEFT JOIN 
    [dbo].[ingredients] i ON r.recipeid = i.recipeid
INNER JOIN 
    [dbo].[users] u ON r.userid = u.userid
  WHERE 
    r.recipename LIKE @input OR
    r.category LIKE @input OR
    r.tags LIKE @input OR
    r.description LIKE @input OR
    i.ingredientname LIKE @input OR
    u.username LIKE @input OR
    u.name LIKE @input;`;

    const result = await pool.request()
      .input('input', sql.NVarChar, input)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await closeDatabaseConnection();
  }
};


//this function is for updateing users password with newPassword and userId
const updatePasswordToDatabase = async (req) => {
  const {newPassword, userId} = req.body;
  try {

      await connectToDatabase();

      const request = pool.request();

      // Encrypts the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // The SQL query to update the password to database
      const query = `
          UPDATE [dbo].[users]
          SET password = @newPassword
          WHERE userid = @userId
      `;
      await request
          .input("newPassword", sql.NVarChar, hashedPassword)
          .input("userId", sql.Int, userId)
          .query(query);
      return true; 
  } catch (error) {
      console.error("Error adding password to the database:", error);
      return false; 
  } finally {
      await closeDatabaseConnection();
  }
}

 

module.exports = {updatePasswordToDatabase, searchRecipesFromDatabase,deleteReviewInDatabase, editReviewInDatabase, addReviewToDatabase, getReviewFromDatabase, deleteRecipeImageFromDatabase, deleteRecipeFromDatabase, deleteIngredientFromDatabase ,addIngredientToDatabase,
   addUserToDatabase, getUserFromDatabase, addRecipeToDatabase, getRecipeFromDatabase, getAllUsersFromDatabase, deleteUserFromDatabase,
    editRecipeToDatabase, getIngredientsFromDatabase, isEmailRegistered, addPasswordToDatabase};