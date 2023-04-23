//connect with the models
const Course = require('../models/course')
const User = require('../models/user')
const Note = require('../models/note')
const {get_ai_questions, get_ai_explanations} = require('./openai')

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
    notes.push(randomNote.contents);
  }
  return notes;
}



cron.schedule('00 8 * * *', async () => {
  const users = await User.find({ discordID: { $ne: '' } }).populate('courses');
  users.forEach(async (user) => {
    // client.users.send(`${user.discordID}`, `Hey, how's it going? Yes, it's that time of the day again! Here are the three blocks of notes we have collected for today. Good luck answering the questions!\n`);
    //delete everything from yesterday
    user.random.notes = []
    user.random.questions = []
    user.random.explanations = []

    //find for the courses with isRemind: true
    const filtered_courses = user.courses.filter(course => course.isRemind)
    const courses = get_three_rand_courses(filtered_courses);

    //get 3 random note blocks
    const notes = await get_three_rand_notes(courses)
    const questions = await get_ai_questions(notes)
    const explanations = await get_ai_explanations(notes, questions)

    //for the choices
    const menus = getMenus();
    
    for(let i = 0; i < notes.length; i++){
        client.users.send(`${user.discordID}`, `Notes ${i+1}: ${notes[i]}`);
        client.users.send(`${user.discordID}`,{ content: `Question ${i+1}: ${questions[i]}`, components: [menus[i]] });
      }    

    //save to user for the day
    user.random.notes = notes 
    user.random.questions = questions
    user.explanations = explanations
    await user.save()
  

  });

});

const getMenus = () =>{
    
    const menus = [];
    for(let i = 0; i < 3; i++){
      const menu = new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId(`${i}`)
              .setPlaceholder("True or False?")
              .addOptions(
                {
                  label: 'True',
                  description: '...or is it?',
                  value: 'true',
                },
                {
                  label: 'False',
                  description: 'be careful what you choose for...',
                  value: 'false',
                },
              ),
          );
  
      menus.push(menu)
  }
  return menus
}

module.exports.print = async () => {
  
};
//future plan: check if it's today's

//could change - get prompt and question from here and use ai here
//if the answer is chosen
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isStringSelectMenu()) return;

  const userId = interaction.user.id
  const index = Number(interaction.customId)
  const users = await User.find({discordID: userId})
  const user = users[0]
  console.log(user)
  const message = user.explanations[index]

  await interaction.update({ content: `${message}`, components: []});

  /*



  c


  //.populate({path: ‘reviews’, populate: { path: ‘author’}}).populate(‘author’)

  console.log("user: ", user)
  
    
  client.users.send( `${userId}`, message);
  //await interaction.update({ content: `${message}`, components: [] });*/
  
});



// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);



