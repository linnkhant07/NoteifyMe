const User = require('../models/user')

module.exports.renderRegisterForm = (req,res)=>{
    res.render('user/register')
}

module.exports.registerUser = async (req,res,next)=>{
    //register the user
    try {
        const {username, email, password: hashedPassword, school} = req.body.user
        const user = new User({email, username, school})
        const registeredUser = await User.register(user, hashedPassword)
        
        req.login(registeredUser, (err) => {
            if(err)
                return next(err)
            
            req.flash('success', 'Welcome to your course shelf!')
            return res.redirect("/courses")
        })

    } catch (error) {
        console.log("error: ", error.message)
        req.flash('error', error.message)
        res.redirect("/register")
    }
}

module.exports.renderLogInForm = (req,res)=>{
    res.render('user/login')
}

module.exports.logInUser = (req,res)=>{
    //if successful
    const redirectUrl = req.session.returnTo || "/courses"
    req.flash('success', "Welcome Back!")
    res.redirect("/courses")
}

module.exports.logOutUser = (req, res, next) => {
    req.logout(function(err) {
        if (err)
        req.flash('success', "Goodbye!")
        res.redirect('/home')
        
})}

module.exports.renderDiscordForm = (req,res,next) =>{
    const {id} = req.params
    res.render(`user/discord`, {id})
}
module.exports.registerDiscord = async (req,res,next) =>{

    try{
        const {id} = req.params
        const user = await User.findByIdAndUpdate(id, {...req.body.user}, {new: true})

        if(!user){
            res.flash('failure', "User Not Found!")
            return res.redirect("/user/register")
        }

        //redirect
        console.log(req.body.user)
        console.log(user)
        req.flash("success", "DiscordID successfully updated")
        res.redirect(`/courses`)
    }

    catch(e){
        res.send(e)
    }
    

}

