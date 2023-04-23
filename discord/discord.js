//connect with the models
const Course = require('../models/course')
const User = require('../models/user')
const Note = require('../models/note')

const cron = require('node-cron');
const generateResponse = require('./openai')

if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
// Create a new client instance
const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent]
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});


/////////testing

//for messages
client.on("messageCreate", async (message) => {

  if (message.content === 'test') {
    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('test')
          .setPlaceholder("this is all testing")
          .addOptions(
            {
              label: 'Option A',
              description: 'This is Option A',
              value: 'A', 
            },
            {
              label: 'Option B',
              description: 'This is Option B',
              value: 'B',
            },
          ),
      );

    await message.reply({ content: 'This is a test. A or B?', components: [row] });
  }
})
///////////testing


module.exports.printHiEvery5Seconds= () => {
    setInterval(() => {
      
      client.users.send('993065925190365229', 'THIS IS THE FINAL TEST');
    }, 5000);
}

cron.schedule('00 09 * * *', () => {
    generateResponse().then(response => {
      
      client.users.send('740276414439489536', `${response}`);
    }) //740276414439489536
    //993065925190365229
});

//function to get random 
function get_three_rand_courses(src){
  const dest = []
  while (dest.length < 3) {
    const random = src[Math.floor(Math.random() * src.length)];
    if (!dest.includes(random)) {
      dest.push(random);
    }
  }
  return dest
}

async function get_three_rand_notes(courses) {
  const notes = [];
  for (let course of courses) {
    const randomNoteIndex = Math.floor(Math.random() * course.notes.length);
    const randomNoteId = course.notes[randomNoteIndex];
    const randomNote = await Note.findById(randomNoteId);
    notes.push(randomNote);
  }
  return notes;
}



cron.schedule('00 8 * * *', async () => {
  const users = await User.find({ discordID: { $ne: '' } }).populate('courses');
    for(let user of users){
      //delete everything from yesterday
      user.random.courses = []
      user.random.questions = []
      user.random.explanations = []

      //find for the courses with isRemind: true
      const filtered_courses = user.courses.filter(course => course.isRemind)
      const courses = get_three_rand_courses(filtered_courses);

      //get 3 random note blocks
      const notes = get_three_rand_notes(courses)
      const questions = []
      const explanations = []

    }
});



// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
