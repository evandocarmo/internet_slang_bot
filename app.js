require('dotenv').config();
const client = require('./reddit-config');
const mongoose = require('mongoose');
const connection = mongoose.connect(process.env.MONGO_URL);
const Slang = require('./models/slang');
const nlp = require('compromise');

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
    let text = nlp(comment.body);
    let acronyms = text.acronyms().data();
    if (acronyms.length)
      for (let acronym of acronyms) {
        let lowerCaseAcronym = acronym.text.toLowerCase();
        let definition = slangLookup[lowerCaseAcronym];
        if (definition && comment.author !== process.env.REDDIT_USER && acronym.text.length > 2) {
          console.log(comment.link_permalink);
          comment.reply(`${acronym.text} means '${definition}'.
            BEEP. BOP. I'm a bot! Was this helpful? PM me for feedback.`);
        }
      }
  });
})
