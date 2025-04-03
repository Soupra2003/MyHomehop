const listing = require('../models/listing')
const Review = require('../models/review')

module.exports.createreview = async (req,res)=>{
    let home = await listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id
    home.reviews.push(newReview)
    await newReview.save()
    await home.save()
    res.redirect(`/homehop/${home._id}`)
}

module.exports.destroyreview = async(req,res) =>{
    let{id, reviewId} = req.params
    await listing.findByIdAndUpdate(id, {$pull :{reviews : reviewId}})
    await Review.findByIdAndDelete(id)

    res.redirect(`/homehop/${id}`)
}