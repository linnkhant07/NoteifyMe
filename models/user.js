const mongoose = require('mongoose');

//strictQuery - only the specified fields in the Schema will be accepted
//to remove depreciation
mongoose.set('strictQuery', true);
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    discordID: {
        type: String,
        unique: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    school: {
        type: String,
        unique: true,
        required: true
    },

    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

userSchema.plugin(passportLocalMongoose)
module.exports = ('User', userSchema)