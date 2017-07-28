const path = require('path');
const dirPath = path.join(process.cwd(), 'twitter-data');
const fs = Promise.promisifyAll(require('fs'));
const moment = require('moment');


let tweetHelper = {
  containsCompany(text) {
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
  },
  filterTweet(tweet) {
    // this needs some love
    let userReply = tweet.indexOf(' ') - 1;
    if (tweet[1] === '@' &&  tweet.includes(':') || tweet.includes('tie')) {
      return false;
    }
    return true;
  }
}

exports.getTweets = function() {
  let totTweets = [];
  return fs.readdirAsync(dirPath)
  .then((files) => {

    files.forEach((file) => {
      let yearObj = require(path.join(dirPath, file));
      for (const tweet of yearObj) {
        let containsObj = tweetHelper.containsCompany(tweet.text);
        if (containsObj.has && (!tweet.is_retweet) && tweetHelper.filterTweet(tweet.text)) {
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
  });
}

exports.removeRT = function(tweet) {
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


exports.getStockTweetData = function(tweet, csv) {
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

  let date = new Date(tweet.date);
  let tweetDate = moment(date).format('YYYY-MM-DD');
  let tweetFutureDate = moment(tweetDate).add(1, 'w').format('YYYY-MM-DD');
  let ticker = stockTickers[tweet.name];
  let stockObj = {name: tweet.name, sentiment: tweet.sentiment, prices: {}};

  return new Promise((resolve, reject) => {
    for (const csvObj of csv) {
      if (csvObj.symbol === ticker && moment(csvObj.date).isSame(tweetDate)) {
        stockObj.prices.prevPrice = csvObj.close;
      }
      if (csvObj.symbol === ticker && moment(csvObj.date).isSame(tweetFutureDate)) {
        stockObj.prices.laterPrice = csvObj.close;
      }
    }
    resolve(stockObj);
  });
}
