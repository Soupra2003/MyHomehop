const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./review')
// const user = require('./user')

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    price:Number,
    image:{
        url:String,
        filename : String,
    },
    location:String,
    country:String,
    reviews :[
        {
            type:Schema.Types.ObjectId,
            ref : "review"
        }
    ],
    owner :{
        type : Schema.Types.ObjectId,
        ref : "user"
    },
    // geometry:{
    //     type: {
    //       type: String, // Don't do `{ location: { type: String } }`
    //       enum: ['Point'], // 'location.type' must be 'Point'
    //       required: true
    //     },
    //     coordinates: {
    //       type: [Number],
    //       required: true
    //     }
    //   }
})

listingSchema.post('findOneAndDelete', async (listing)=>{
    if (listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
})

//Booking Schema 



const listing = mongoose.model('listing',listingSchema)
module.exports = listing