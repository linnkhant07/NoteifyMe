const express = require('express')
const router = express.Router({mergeParams: true}) 
const note = require('../controllers/note')
const catchAsync = require('../utils/catchAsync')
const {validateNote, isLoggedIn} = require('../middleware')

//Create route
router.post("/", isLoggedIn, validateNote, note.createNote)

//Delete route
router.delete("/:noteId", isLoggedIn, catchAsync(note.deleteNote))

module.exports = router