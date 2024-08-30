const {badRequest, created, internalServerError, notFound, ok} = require('../utils/responseUtils')
const {getReviewFromDatabase, addReviewToDatabase, editReviewInDatabase, deleteReviewInDatabase} = require('../database')


//Searches reviews
const searchReviews = async (req, res) => {
    try {
        const reviews = await getReviewFromDatabase(req, res);
        if (!reviews || reviews.length === 0) {
            return notFound(res, "Reviews not found");
        }

        return ok(res,'search completed' ,{ reviews });

    } catch (error) {
        console.error("Error searching reviews: " + error);
        return internalServerError(res, "Internal server error while searching for reviews");
    }
};

//Adds review
const addReview = async (req, res) => {
    try {
        if(!addReviewToDatabase(req, res)) {
            badRequest(res, "Failed to add review to database.")
        }
        return created(res, "Review added to database successfully.")
    }catch(error) {
        console.error("Error adding review to database: " + error)
        return internalServerError(res, "Internal server error, while adding review");
    }
}
//Edits review
const editReview = async (req, res) => {
    try {
        if(!editReviewInDatabase(req, res)) {
            badRequest(res, "Failed to edit review.")
        }
        return created(res, "Review edited successfully.")
    }catch(error) {
        console.error("Error editing review: " + error)
        return internalServerError(res, "Internal server error, while adding review");
    }
}
//Deletes review
const deleteReview = async (req, res) => {
    try {
        if(!deleteReviewInDatabase(req, res)) {
            badRequest(res, "Failed to edit review.")
        }
        return created(res, "Review edited successfully.")
    }catch(error) {
        console.error("Error editing review: " + error)
        return internalServerError(res, "Internal server error, while adding review");
    }
}







module.exports = {searchReviews, addReview, editReview, deleteReview}

