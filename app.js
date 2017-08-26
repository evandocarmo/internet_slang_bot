require('dotenv').config();
const client = require('./reddit-config');
const mongoose = require('mongoose');
const connection = mongoose.connect(process.env.MONGO_URL);
const Slang = require('./models/slang');

const streamOptions = { // reddit API stream options
  subreddit: 'all',
  results: 25
};

Slang.find({}, (err, slangs) => { //get all the slangs from database
  if (err)
    console.log(err);
  let slangLookup = {};
  for (let slang of slangs) {
    slangLookup[slang.slang] = slang.definition; //creates a lookup table for the definitions
  }
  const comments = client.CommentStream(streamOptions);
  comments.on('comment', (comment) => {
    let wordArray = comment.body.match(/\b[A-Z]{3,}\b/g);
    if (wordArray) {
      console.log(wordArray);
      for (let word of wordArray) {
        if (slangLookup.hasOwnProperty(word.toLowerCase()) && comment.author !== process.env.REDDIT_USER) {
          console.log(word, slangLookup[word.toLowerCase()]);
          comment.reply(`${word} means '${slangLookup[word.toLowerCase()]}'. BEEP. BOP.`);
        }
      }
    }
  });
})
