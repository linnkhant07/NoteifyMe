const express = require('express')
const router = express.Router()
//require controllers here
const catchAsync = require('../utils/catchAsync')
const course = require('../controllers/course')

const {isLoggedIn, validateCourse} = require('../middleware')

//CRUD
router.route("/")
.get(isLoggedIn, catchAsync(course.index)) //Index route
.post(isLoggedIn, validateCourse,  catchAsync(course.createCourse))
//validateCourse,
//upload.single('course[image]'),

//New Route
router.get("/new", isLoggedIn, course.renderNewForm)

router.route("/:id")
.get(catchAsync(course.showCourse)) //show path
.put(isLoggedIn, validateCourse, catchAsync(course.updateCourse))
//upload.array("course[image]"), 
.delete(isLoggedIn,  catchAsync(course.deleteCourse))
//isAuthor,

//edit route
router.get("/:id/edit", isLoggedIn, catchAsync(course.renderEditForm))

module.exports = router