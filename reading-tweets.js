
const path = require('path');
const dirPath = path.join(process.cwd(), 'twitter-data');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const request = require('request-promise');

let totTweets = [];
let directory = path.join(process.cwd(), 'twitter-data');
let toFile = 'result.txt';

fs.readdirAsync(dirPath)
.then((files) => {

  files.forEach((file) => {
    let yearObj = require(path.join(dirPath, file));
    for (const tweet of yearObj) {
      let containsObj = containsCompany(tweet.text);
      if (containsObj.has && (!tweet.is_retweet) && filterTweet(tweet.text)) {
        let tweetObj = {
          name: containsObj.name,
          date: tweet.created_at,
          text: tweet.text
        }
        totTweets.push(tweetObj);
      }
    }
  });
  return totTweets;
})
.then((totTweets) => {
  debugger;
  return totTweets.map((tweet) => {
    return getSentiment(tweet);
  });
})
.then((arr) => {
  return totTweets.map(())
  console.log(arr);
})
.catch((err) => {
  console.error(err);
});

// for each tweet
// get stock of company for that day
// get price of that day - would have bought
// get price of 30 days later
// get difference BUY (if diff pos ++) else --
//                SELL (if diff neg ++) else --
// pos - buy at that day price
// neg - sell at that day price
function getStockDifference(tweet) {
  let general = 'general motors';
  let mobile = 't-mobile';
  let stockTickers = {
    nordstrom: 'JWN',
    general: 'GM',
    boeing: 'BA',
    apple: 'APPL',
    macy: 'M',
    mobile: 'TMUS'
  };
  let date = new Date('Wed Nov 26 23:13:59 +0000 2014');
  let tweetDate = moment(date).format('YYYY-MM-DD');
  let futureDate = moment(tweetDate).add(1, 'M').format('YYYY-MM-DD');
  let ticker = stockTickers[tweet.name];

  


}



function getSentiment(tweet) {
  let newTweetText = removeRT(tweet.text);
  let options = {
    method: 'POST',
    uri: 'http://text-processing.com/api/sentiment/',
    form: {
        text: newTweetText
    }
  };
  request(options)
    .then((apiBody) => {
        let tweetData = JSON.parse(apiBody);
        tweet.label = tweetData.label;
        return tweet;
    });
}

function containsCompany(text) {
  let stockCompanies = ['nordstrom', 'general motors', ,'boeing', 'apple', 'macy', 't-mobile'];
  let ret = {
    has: false,
    name: null
  }
  for (const c of stockCompanies) {
    if (text.toLowerCase().includes(c)) {
      ret = {
        has: true,
        name: c
      }
    }
  }
  return ret;
}

function removeRT(tweet) {
  let i = 0;
  let retTweet = '';
  let skip = false;
  while (i < tweet.length) {
    if (tweet[i] === ' ' && skip) {
      skip = false;
    } else if (tweet[i] === '@') {
      skip = true;
    } else if (!skip) {
      retTweet += tweet[i];
    }
    i++;
  }
  return retTweet;
}

function filterTweet(tweet) {
  // this needs some love
  let userReply = tweet.indexOf(' ') - 1;
  if (tweet[1] === '@' &&  tweet.includes(':') || tweet.includes('tie')) {
    return false;
  }
  return true;
}
