const { boolean } = require('joi');
const mongoose = require('mongoose');

//strictQuery - only the specified fields in the Schema will be accepted
//to remove depreciation
mongoose.set('strictQuery', true);
const Schema = mongoose.Schema;


const noteSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    contents: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isRemind: Boolean
  });

module.exports = mongoose.model('Note', noteSchema)