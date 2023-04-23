const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_TOKEN,
});
const openai = new OpenAIApi(configuration);

async function get_three_questions(notes){
    const questions = []

    for(let note of notes){
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: "Th",
            temperature: 0.5,
        });
    }
}

async function generateResponse(){
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "",
        temperature: 0.5,
      });

    return response.data.choices[0].text
}

module.exports = generateResponse;