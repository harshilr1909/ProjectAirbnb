const CustomError = require('../utils/customError.js');
const {listingSchema} = require('../validateSchema/joiSchema.js');

module.exports.validateList  =  (req,res,next) => {
    let {error,value} =  listingSchema.validate(req.body);
    if(error) {
    let errMsg = error.details.map((el) => el.message).join("");
    throw new CustomError(400,errMsg);
    }else{
	next();
    }
};
