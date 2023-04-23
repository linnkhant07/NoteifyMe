const Course = require("./models/course")
const ExpressError = require('./utils/ExpressError')
const {courseSchema} = require('./schemas')


module.exports.isLoggedIn = (req,res,next) => {

    if(!req.isAuthenticated()){
        //remember the route they came from
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in to take this action')
        return res.redirect('/login')
    }
    next()
}

//JOi validator function
module.exports.validateCourse = (req,res,next) => {
    next()
}

module.exports.validateNote = (req,res,next) =>{
    //check if there is an error
    next()
}