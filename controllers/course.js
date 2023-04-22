//require models

const Course = require('../models/course')
const User = require('../models/user')

module.exports.index = async(req,res) => {
    //show all courses (for now)
    return res.send("Index")
    //stubs
    const id = req.user._id
    const {discordID, courseshelf} = await User.findById(id).populate('courseshelf')
    res.render("courses/index", {courseshelf, discordID, id})
}

module.exports.renderNewForm = (req,res) => {
    return res.send("New")
    //stubs
    //form to create new course
    res.render("courses/new")
}

module.exports.createCourse = async (req,res) => {
    return res.send("Create")
    //stubs
    //add new course to the database
    try {
        const course = new Course(req.body.course)
        await course.save()

        const user = await User.findById(req.user._id)
        user.courseshelf.push(course._id)
        await user.save()

        
        req.flash("success", "Course successfully saved")
        //redirect to show page
        res.redirect(`/courses`)  
    } catch (error) {
     console.log("error:", error)   
    }

      

}

module.exports.showCourse = async (req,res) =>{
    return res.send("Index")
    //stubs
    //get id
    const {id} = req.params;
    const course = await Course.findById(id).populate("chapters")

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
    return res.send("Update")
    //stubs
    //get id
    const {id} = req.params
    const course = await Course.findByIdAndUpdate(id, {...req.body.course}, {new: true})

    if(!course){
        req.flash("error", "cannot find course")
        return res.redirect("/courses")
    }
    //update in the db
    //worry about the image later
    req.flash("success", "Course successfully updated")
    res.redirect(`/courses/${id}`)

}

module.exports.deleteCourse = async (req,res) => {
    
    return res.send("Create")
    //stubs
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