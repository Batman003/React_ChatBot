require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = process.env.API_KEY;
let answer = null; 
let prompt= "What is the capital of India?";

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

app.post('/api', (req, resp) => {

        prompt = req.body.prompt;
        client.generateMessage({
          model: MODEL_NAME, // Required. The model to use to generate the result.
          temperature: 0.5, // Optional. Value `0.0` always uses the highest-probability result.
          candidateCount: 1, // Optional. The number of candidate results to generate.
          prompt: {
            // Required. Alternating prompt/response messages.
            messages: [{ content: prompt}],
          },
        }).then(
        (result) => {
          if(result[0].candidates.length === 0){
            answer='Unexpected error happened! Try with another query.';
          }else{
            answer=result[0].candidates[0].content;  
          }          
            resp.json(answer);
        }).catch((err) => {
            console.error(err);
            resp.json(JSON.stringify(err.details));
        });
      });

app.listen(3333, () => console.log('server running on port 3333'))
