const {internalServerError, notFound, ok} = require('../utils/responseUtils')
const {getIngredientsFromDatabase, addIngredientToDatabase, deleteIngredientFromDatabase} = require('../database')

//Searches ingredients
const getIngredients = async (req, res) => {
    try {
        const ingredients = await getIngredientsFromDatabase(req, res);
        if (!ingredients || ingredients.length === 0) {
            return notFound(res, "Ingredients not found in the database");
        }
        return ok(res, "Ingredients found from database", { ingredients });

    } catch (error) {
        console.error("Error getting ingredients: " + error);
        return internalServerError(res, "Internal server error while searching for recipes");
    }
};
 
//Adds ingredient
const addIngredient = async (req, res) => {
    try {
        const result = await addIngredientToDatabase(req, res);
        
        if (!result || result.length === 0) {
            return notFound(res, "Ingredients not found in the database");
        }
        return ok(res, "Ingredient added to database", { result });

    } catch (error) {
        console.error("Error getting ingredients: " + error);
        return internalServerError(res, "Internal server error while searching for recipes");
    }
};

//Deletes ingredient
const deleteIngredient = async (req, res) => {
    try {
        const result = await deleteIngredientFromDatabase(req, res);
        if (!result || result.length === 0) {
            return notFound(res, "Ingredient not found in the database");
        }
        return ok(res, "Ingredient delete from database");

    } catch (error) {
        console.error("Error deleting ingredient: " + error);
        return internalServerError(res, "Internal server error while searching for recipes");
    }
};
module.exports = {getIngredients, addIngredient, deleteIngredient};