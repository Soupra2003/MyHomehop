const express = require('express')
const router = express.Router()
const user = require('../models/user')
const wrapAsync = require('../utilit/wrapAsync')
const passport = require('passport')
const { saveredirecturl } = require('../midddleware')
const usercontroller = require('../Controller/user')
const listingController = require('../Controller/listing')

router.get('/signup',(req,res)=>{
    res.render('User/signup')
})

router.post('/signup',wrapAsync(usercontroller.signup))

router.get('/login',(req,res)=>{
    res.render('User/login')
})

router.post('/login', 
saveredirecturl,
passport.authenticate('local',{failureRedirect :"/login", failureFlash:true}),
usercontroller.login)

router.get('/logout', usercontroller.logout)

router.get('/myaccount',listingController.myaccount)

router.get('/myaccount/mybooking', listingController.mybooking)

module.exports = router
