const mongoose = require('mongoose');
const User = require('../models/user')
const Course = require('../models/course')
const Note = require('../models/note')

const dbUrl = 'mongodb://127.0.0.1:27017/remindMe'
// Connect to the database
mongoose.connect(dbUrl, { useNewUrlParser: true });

// Define some sample data
const users = [
  {
    email: 'john@example.com',
    school: 'Harvard University',
    random: {
      notes: ['Note 1'],
      questions: ['Question 1'],
      explanation: ['Explanation 1'],
    },
    courses: []
  },
  {
    email: 'jane@example.com',
    school: 'Stanford University',
    random: {
      notes: ['Note 2'],
      questions: ['Question 2'],
      explanation: ['Explanation 2'],
    },
    courses: []
  }
];

const courses = [
  {
    title: 'Introduction to Computer Science',
    instructor: 'Dr. Smith',
    description: 'This course provides an introduction to computer science.',
    notes: [],
    isRemind: true
  },
  {
    title: 'Calculus I',
    instructor: 'Dr. Johnson',
    description: 'This course covers the basics of calculus.',
    notes: [],
    isRemind: true
  },
  {
    title: 'English Composition',
    instructor: 'Dr. Brown',
    description: 'This course teaches effective writing skills.',
    notes: [],
    isRemind: true
  }
];

const notes = [
  {
    title: 'Note 1',
    contents: 'Arrays and data structures are fundamental concepts in computer science and programming. An array is a collection of elements, each identified by an index or a key, and stored in contiguous memory locations. It is a simple and efficient way to store and retrieve a large amount of data. However, it has some limitations, such as fixed size and limited flexibility',
    user: null,
    isRemind: true
  },
  {
    title: 'Note 2',
    contents: 'In calculus, a derivative is a measure of how a function changes as its input value changes. It is defined as the limit of the ratio of the change in the output value of a function to the change in its input value, as the change in the input value approaches zero. In other words, it is the slope of the tangent line to the function at a given point',
    user: null,
    isRemind: true
  }
];

// Insert the sample data into the database
User.insertMany(users)
  .then((users) => {
    console.log('Inserted users:', users);

    // Associate the first course with the first user
    courses[0].notes.push(notes[0]._id);
    users[0].courses.push(courses[0]._id);

    // Associate the second course with both users
    courses[1].notes.push(notes[0]._id);
    courses[1].notes.push(notes[1]._id);
    users[0].courses.push(courses[1]._id);
    users[1].courses.push(courses[1]._id);

    // Associate the third course with the second user
    courses[2].notes.push(notes[1]._id);
    users[1].courses.push(courses[2]._id);

    return Note.insertMany(notes);
  })
  .then((notes) => {
    console.log('Inserted notes:', notes);

    return Course.insertMany(courses);
  })
  .then((courses) => {
    console.log('Inserted courses:', courses);

    return User.updateMany({}, { $set: { courses: courses.map(course => course._id) } });
  })
  .then(() => {
    console.log('Seeding complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
