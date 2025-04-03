const express = require('express')
const router = express.Router({mergeParams :true})

const wrapAsync = require('../utilit/wrapAsync')
const expressError = require('../utilit/expressError')
const {listingSchema,reviewSchema} = require('../joiSchema.js')
const listing = require('../models/listing')
const Review = require('../models/review.js')
const { isLoggedIn,isAuthor } = require('../midddleware.js')
const reviewcontroller = require('../Controller/review.js')
// review validation
const validatereview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
    console.log(req.body)
    console.log(error)
    if(error){
     throw new expressError(400, error)
    }else{
        next()
    }
}
 
//Review (post)
router.post('/', isLoggedIn ,validatereview ,wrapAsync(reviewcontroller.createreview))
//Delete Review
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewcontroller.destroyreview))

module.exports = router
