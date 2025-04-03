const mongoose = require('mongoose')
// const Schema = mongoose.Schema

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "listing", required: true },
    checkin: { type: Date, required: true },
    checkout: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
    
});

module.exports = mongoose.model("Booking", bookingSchema);