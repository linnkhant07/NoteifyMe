//require models

const Course = require('../models/course')
const User = require('../models/user')

module.exports.index = async(req,res) => {
    //stubs
    const id = req.user._id
    const {discordID, courses, username, description} = await User.findById(id).populate('courses')
    res.render("courses/index", {courses, discordID, description, username, id})
}

module.exports.renderNewForm = (req,res) => {
    //form to create new course
    res.render("courses/new")
}

module.exports.createCourse = async (req,res) => {
    //add new course to the database
    try {
        const course = new Course(req.body.course)
        //to delete later
        course.isRemind = true;
        await course.save()

        const user = await User.findById(req.user._id)
        user.courses.push(course._id)
        await user.save()

        
        req.flash("success", "Course successfully saved")
        //redirect to show page
        res.redirect(`/courses`)  
    } catch (error) {
     console.log("error:", error)   
    }

      

}

module.exports.showCourse = async (req,res) =>{

    //get id
    const {id} = req.params;
    const course = await Course.findById(id).populate("notes")

    if(!course){
        req.flash("error", "Could not find course")
        return res.redirect("/courses")
    }

    res.render("courses/show", {course})
    
}

module.exports.renderEditForm = async (req,res) =>{     
    //id
    const {id} = req.params;

    const course = await Course.findById(id)

    if(!course){
        req.flash("error", "cannot find course")
        return res.redirect("/courses")
    }

    res.render("courses/edit", {course})
}

module.exports.updateCourse = async (req,res) =>{
    //get id
    const {id} = req.params
    const course = await Course.findByIdAndUpdate(id, {...req.body.course}, {new: true})

    if(!course){
        req.flash("error", "cannot find course")
        return res.redirect("/courses")
    }
    //update in the db
    req.flash("success", "Course successfully updated")
    res.redirect(`/courses/${id}`)

}

module.exports.deleteCourse = async (req,res) => {

    try {
            //get id
        const {id} = req.params;
        await User.findByIdAndUpdate(req.user._id, {$pull: {courseshelf: id}})
        const course = await Course.findByIdAndDelete(id)

        if(!course){
            req.flash("error", "Cannot find course")
            return res.redirect("/courses")
        }

        req.flash("success", "Course successfully deleted")
        res.redirect("/courses")
    } catch (error) {
        res.send(`Error: ${error}`)
    }

}