const List = require('../models/listing.js');

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let indidata = await List.findById(id);
    if(!res.locals.currUser._id.equals(indidata.owner._id)) {
	req.flash("error","You don't have the permission ");
	return res.redirect(`/listings/${id}`);
    }
    next();
}
