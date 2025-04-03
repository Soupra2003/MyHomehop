const listing = require('./models/listing')
const Review = require('./models/review')

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirecturl = req.originalUrl
        // console.log(req.session.redirecturl)
        req.flash('error','You are not Logged in')
        return res.redirect('/login')
    }
    next()
}

module.exports.saveredirecturl = (req,res,next) =>{
    if(req.session.redirecturl){
        res.locals.redirecturl = req.session.redirecturl
    }
    next()
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params
    let Curlisting = await listing.findById(id)
    if(!Curlisting.owner._id.equals(res.locals.curUser._id)){
        req.flash('error',"You are not the owner of this Property ")
        return res.redirect(`/homehop/${id}`)
    }
    next()
}

module.exports.isAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params
    let review = await Review.findById(reviewId)
    if(!review.author._id.equals(res.locals.curUser._id)){
        req.flash('error',"You are not the author of this review ")
        return res.redirect(`/homehop/${id}`)
    }
    next()
}

