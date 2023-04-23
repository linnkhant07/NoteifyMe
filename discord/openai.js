if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_TOKEN,
});
const openai = new OpenAIApi(configuration);

async function get_ai_questions(notes) {
    const questions = []

    for(let note of notes){
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `This is the text: ${note}\n Give me a true/false question about this text. The question should be suitable for an exam. `,
            temperature: 0.5,
            max_tokens: 50
        });
        question = response.data.choices[0].text + "\n A. True B. False"
        questions.push(question)
    }

    return questions
}

async function get_ai_explanations(notes, questions) {
    const explanations = []

    for(i = 0; i < 3; i++){
        const explanation = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `This is the prompt: ${notes[i]}\n This is the question: ${questions[i]}\n Give me the answer and explantion in one sentence`,
            temperature: 0.5,
            max_tokens: 50
        });
        explanations.push(explanation.data.choices[0].text)
    }


    return explanations
}

async function generateResponse(){
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "",
        temperature: 0.5,
      });

    return response.data.choices[0].text
}

module.exports = {generateResponse, get_ai_questions, get_ai_explanations};