if(process.env.NODE_ENV != 'production'){
    require("dotenv").config()
}

const express  = require('express')
const mongoose = require("mongoose")
const path = require('path')
const app = express()
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const wrapAsync = require('./utilit/wrapAsync')
const expressError = require('./utilit/expressError')
const {listingSchema,reviewSchema} = require('./joiSchema.js')
const session = require('express-session')
const Mongstore = require('connect-mongo')
const flash = require('connect-flash')
const Localstrategy = require('passport-local')
const dburl = "mongodb+srv://soupra2003:spramanik2003@homehop.dp27k.mongodb.net/?retryWrites=true&w=majority&appName=homehop"
// const dburl = "mongodb://localhost:27017/Homehop";

const homehop = require('./routes/listing.js')
const review = require('./routes/review.js')
const user = require('./routes/user.js')

const User = require('./models/user.js')

const passport = require('passport')

const store = Mongstore.create({
    mongoUrl:dburl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter : 24*3600
})

store.on("error",()=>{
    console.log("Error in Mongo Session store ",err)
})
const sessionOption = ({
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    }
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(methodOverride('_method'))
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname, '/public')))



app.use(session(sessionOption))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new Localstrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.curUser = req.user
    next()
})

// app.get('/demouser',async (req,res)=>{
//     let fakeUser = new User({
//         email : 'soupra@gmail.com',
//         username : 'soupra'
//     })

//     let registeredUser  = await User.register(fakeUser, "soupra2")
//     res.send(registeredUser)
// })

//connect to MongoDB
// const monoUrl = process.env.ATLAS_URL

async function main(){
    mongoose.connect(dburl)
}
main()
    .then(()=>{
        console.log("Connected to mongoDB")
    })
    .catch(err =>{
        console.log(err)
    })

//sample route for checking 
app.get("/",(req,res)=>{
    res.send("Sucessfull")
})

app.use('/homehop',homehop)
app.use('/homehop/:id/reviews',review)
app.use('/',user)

app.all('*',(req,res,next)=>{
    next(new expressError(404, 'Page not found'))
})

//Error handeling middleware 
app.use((err,req,res,next)=>{
    let{status = 500,message = 'something went wrong'} = err
    res.render('error',{ message })
    next()
})

//server listing
app.listen(3000,()=>{
    console.log("Server is running")
})