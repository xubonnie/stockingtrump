const Twitter = require('twitter');
const Promise = require('bluebird');
const util = require('util');
const path = require('path');
const fs = require('fs');
const analyze = require(path.join(process.cwd(), 'analyze-tweets'));

// cred variables
let ACCESS_TOKEN = '771826916718288896-CWcYz3ytJDBav7EqwV8vPEWFUfbrazk';
let ACCESS_SECRET = 'DPjNY6K5URXybLmtFZkJLkwTvLDLyZUqPntor9ZCKuToE';
let CONSUMER_KEY = 'cX31uPxg6i4zsFXBPiOWsoRPr';
let CONSUMER_SECRET = '9b4syA9t3Mqt3gouLlp0Sgz5wZdfl6J278A2K1GhfnoAZd5BH6';

// get credentials
const client = new Twitter({
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET,
  access_token_key: ACCESS_TOKEN,
  access_token_secret: ACCESS_SECRET
});


function requestTwitterData(maxId) {
  client.get('statuses/user_timeline', {screen_name: 'realDonaldTrump', count: 200, max_id: maxId})
    .then((tweet) => {
        let id = analyze(tweet);
        return id;
    })
    .catch((err) => {
      console.error(err);
    });
}


// let count = 0;
let max_id = 883220875444715500;

requestTwitterData(max_id);




// while (count < 10) {
//   setTimeout(function() {
//     console.log('here, after waiting');
//     max_id = requestTwitterData(max_id);
//   }, 1000*60*15);
//   count += 1;
// }
//
