const mongoose = require('mongoose');

//strictQuery - only the specified fields in the Schema will be accepted
//to remove depreciation
mongoose.set('strictQuery', true);
const Schema = mongoose.Schema;

//DONT FORGET TO DO PRE AND POSTS!!!

const Note = require('./note');
const { boolean } = require('joi');

const courseSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },

    instructor: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },
    
    notes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }],

    isRemind: Boolean
});

//if course is deleted, delete the notes  
courseSchema.post('findOneAndDelete', async (course) =>{
    //if there is any note
    if(course.notes.length){
        const res = await Note.deleteMany({_id: {$in: course.notes}})
    }
})

const Course = mongoose.model('Course', courseSchema)
module.exports = Course;