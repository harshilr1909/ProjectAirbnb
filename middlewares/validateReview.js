const CustomError = require('../utils/customError.js');
const {reviewSchema} = require('../validateSchema/joiSchema.js');

module.exports.validateReview =  (req,res,next) => {
    let {error,value} = reviewSchema.validate(req.body);
    if(error) {
    let errMsg = error.details.map((el) => el.message).join("");
    throw new CustomError(400,errMsg);
    }else{
    next();
    }
};
