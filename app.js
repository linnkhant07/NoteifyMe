//for express
const express = require('express');
const app = express();

//for discord
const {printHiEvery5Seconds} = require("./discord/discord")


//models
const User = require("./models/user")

//.env
if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}
//path join
const path = require('path')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const Course = require('./models/course')

//passport
const passport = require('passport')
const localStrategy = require('passport-local')

//for session
const session = require('express-session')

//routes
const userRoutes = require("./routes/user")
const courseRoutes = require("./routes/course")
const noteRoutes = require("./routes/note")

//dbUrl for mongoAtlas
const dbUrl = 'mongodb://127.0.0.1:27017/remindMe'
//'mongodb://127.0.0.1:27017/smth

//connect-mongo for session store
const MongoDBStore = require("connect-mongo")
const store = new MongoDBStore({
    mongoUrl: dbUrl,
    secret: 'siuuuu',
    touchAfter: 24 * 60 * 60
})

//for session and expiration
const sessionConfig = {
    store,
    name: 'yourSession',
    secret: "siuuuucret", 
    httpOnly: true,
    resave: false, 
    saveUninitialized: true,
    cookie: {
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

//passport - authenticate user

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//for flash
const flash = require('connect-flash')
app.use(flash())

//ejs set paths
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//for login & flash
app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})

//ejs set engine for layouts
app.engine('ejs', ejsMate);

//serving public files
app.use(express.static(path.join(__dirname, 'public')))

//to parse the data from req.body
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

 //method-override
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

//for mongo sanitize - to prevent xss
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());

//for helmet
const helmet = require('helmet');

//tweaking contentsecuritypolicy to allow certain resources
/* 

    const scriptSrcUrls = [
    "https://blah.com/",
];
    YOU NEED TO INSERT HERE TURSTABLE LINKS!!!!
*/

//connect to mongoDB  using mongoose
const mongoose = require("mongoose");mongoose.connect(dbUrl);

const db = mongoose.connection; //fancier, cleaner and to close the connection in the future
//we can do usual things too - this is just another way ig
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

//strictQuery - only the specified fields in the Schema will be accepted
//to remove depreciation
mongoose.set('strictQuery', true);

//default route
app.get("/", (req,res)=>{
    res.redirect("/home")
})
app.get("/home", (req,res)=>{
    res.render("home");
})


//CRUD
app.use("/courses", courseRoutes)
app.use("/", userRoutes)
/*
app.use("/books/:id/chapters", chapterRoutes)


//ERROR HANDLERS

//404 Not Found
app.all('*', (req,res,next)=>{
    next(new ExpressError("404 Page Not Found", 404))
})


//Basic Error Handler
app.use((err, req, res, next)=>{
   // const {message = "Something went wrong", statusCode = 500} = err;
    if(!err.message) err.message = "Something went wrong";
    if(!err.statusCode) err.statusCode = 400;

    res.status(err.statusCode).render("error", {err});
})

//printHiEvery5Seconds()
*/
//listen on port 3000
app.listen(3000, ()=>{
    console.log("Project listening on Port 3000!");
})


