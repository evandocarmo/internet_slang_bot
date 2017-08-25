require('dotenv').config();

const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');

const r = new Snoowrap({
    userAgent: 'internet_slang_bot',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
});
const client = new Snoostorm(r);

const streamOpts = {
    subreddit: 'all',
    results: 25
};

const comments = client.CommentStream(streamOpts);

comments.on('comment', (comment) => {
    if(comment.body.includes(`AFAIK`) && comment.author !== process.env.REDDIT_USER){
      comment.reply(`AFAIK means 'as far as I know'`);
      console.log(comment);
    }
});
