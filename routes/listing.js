const express = require('express')
const router = express.Router()
// const wrapAsync = require('../utilit/wrapAsync')
const expressError = require('../utilit/expressError')
const {listingSchema,reviewSchema} = require('../joiSchema.js')
const listing = require('../models/listing')
const {isLoggedIn,isOwner} = require('../midddleware.js')
const listingcontroller = require('../Controller/listing.js')
const multer = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})

//listing validation  
const validatelisting = (req, res, next) => {
    // console.log("Request Body:", req.body); 
    let { error } = listingSchema.validate(req.body.listing);
    if (error) {
        console.log(error)
        throw new expressError(400, error.details.map(err => err.message).join(", "));
    } else {
        next();
    }
};

//Index Route to show all the listing
router.get('/',listingcontroller.indexlisting)

//New listing
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('new')
})

//show route
router.get('/:id', listingcontroller.showlisting)

//add new listing to database
router.post('/', isLoggedIn , validatelisting,upload.single('listing[image]'), listingcontroller.newlisting)

//Edit route
router.get('/:id/edit', isLoggedIn ,isOwner, (listingcontroller.editlisting))

//update route
router.put('/:id',isLoggedIn, isOwner, upload.single('findcontent[image]'),validatelisting, (listingcontroller.updatelisting))

//Delete Route
router.delete('/:id',isLoggedIn,isOwner,listingcontroller.deletelisting)

router.post('/:id/payment', isLoggedIn,listingcontroller.payment )



module.exports = router