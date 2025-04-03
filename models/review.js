// const { required } = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const reviewSchema = new Schema({
    comment : {
        type : String
    },
    rating : {
        type : Number,
        min : 1,
        max : 5 
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    author:{
        type : Schema.Types.ObjectId,
        ref :'user'
    }
})

const review = mongoose.model('review', reviewSchema)
module.exports = review