const path = require('path');
const dirPath = path.join(process.cwd(), 'twitter-data');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const request = require('request-promise');
const moment = require('moment');
const csvFilePath ='prices-split-adjusted.csv';
const csv = require('csvtojson');
const debug = require('debug');

let totTweets = [];
let directory = path.join(process.cwd(), 'twitter-data');
let toFile = 'result.txt';


getTweets()
.then((tweetsArr) => {
  return Promise.map(tweetsArr, (tweet) => {
    return addSentiment(tweet);
  });
})
.then((tweets) => {
  return filterCsv(tweets);
})
.then((tweetsCsvArr) => {
  return Promise.map(tweetsCsvArr[1], (tweet) => {
    return getStockTweetData(tweet, tweetsCsvArr[0])
  });
})
.then((stockObjArr) => {
  return getTradingResults(stockObjArr);
})
.then((net) => {
  console.log('You would\'ve made', `$${net.toFixed(2)}`);
})
.catch((err) => {
  console.error(err);
})

function getTweets() {
  return fs.readdirAsync(dirPath)
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
  });
}





function getTradingResults(stockObjArr) {
  return new Promise((resolve, reject) => {
    let net = 0;
    for (const stockObj of stockObjArr) {
      let prevPrice = stockObj.prices.prevPrice;
      let laterPrice = stockObj.prices.laterPrice
      if (prevPrice && laterPrice) {
        let diff = shouldBuy() ? (laterPrice - prevPrice) : (prevPrice - laterPrice);
        net += diff * 1000;
      }
    }
    resolve(net);
  });
}

function shouldBuy(sentiment) {
  if (sentiment === 'pos') {
    return true;
  }
  return false;
}

function filterCsv(tweets) {
  let stockTickers = {
    'JWN': true,
    'GM': true,
    'BA': true,
    'APPL': true,
    'M': true,
    'TMUS': true
  };
  let converter = csv({
    trim: true,
    delimeter: ',',
    checkType: true
  });
  return new Promise((resolve, reject) => {
    let csvArr = [];
    converter
      .fromFile(csvFilePath)
      .on('json', (csvObj) => {
        if (stockTickers[csvObj.symbol]) {
          csvArr.push(csvObj);
        }
      })
      .on('end', (err) => {
        if (err) reject(err);
        resolve([csvArr, tweets]);
      })
  })
}

function getStockTweetData(tweet, csv) {
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

function addSentiment(tweet) {
  return new Promise((resolve, reject) => {
    getSentiment(tweet)
    .then((label) => {
      tweet.sentiment = label
      resolve(tweet);
    })
    .catch((err) => {
      reject(err);
    });
  });
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
  return request(options).then((body) => {
    let sentiment = JSON.parse(body);
    return sentiment.label;
  }).catch((err) => console.error(err));
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
