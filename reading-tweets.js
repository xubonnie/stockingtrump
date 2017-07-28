
const path = require('path');
const dirPath = path.join(process.cwd(), 'twitter-data');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const request = require('request-promise');
const moment = require('moment');
const csvFilePath='prices-split-adjusted.csv';
const csv=require('csvtojson');

let totTweets = [];
let directory = path.join(process.cwd(), 'twitter-data');
let toFile = 'result.txt';

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



getTweets()
.then((tweetsArr) => {
  return Promise.map(tweetsArr, (tweet) => {
    return addSentiment(tweet);
  });
})
.then((tweets) => {
  const converter = csv({
    trim: true,
    delimeter: ',',
    checkType: true
  });
  return new Promise((resolve, reject) => {
    converter
      .fromFile(csvFilePath)
      .on('end_parsed', (csvObj) => {
        resolve([tweets, csvObj]);
      })
      .on('end', (err) => {
        reject(err)
      });
  })

})
.then((tweetsData) => {
  console.log(tweetsData);
});



// for each tweet
// get stock of company for that day
// get price of that day - would have bought
// get price of 30 days later
// get difference BUY (if diff pos ++) else --
//                SELL (if diff neg ++) else --
// pos - buy at that day price
// neg - sell at that day price
//

// csv()
// .fromFile(csvFilePath)
// .on('json',(data)=> {
//   let date = new Date('Wed Nov 26 23:13:59 +0000 2014');
//   let tweetDate = moment(date).format('YYYY-MM-DD');
//   let tweetFutureDate = moment(tweetDate).add(1, 'M').format('YYYY-MM-DD');
//   if (data.symbol === 'AAPL' && moment(data.date).isSame(tweetDate)) {
//     console.log('Present Date: %s Symbol: %s Close: %s', data.date, data.symbol, data.close);
//   }
//   if (data.symbol === 'AAPL' && moment(data.date).isSame(tweetFutureDate)) {
//     console.log('Future Date: %s Symbol: %s Close: %s', data.date, data.symbol, data.close);
//   }
// })
// .on('done',(error)=>{
//     console.log('end')
// })

//
function getStockDifference(tweet, data) {
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
  let futureDate = moment(tweetDate).add(1, 'M').format('YYYY-MM-DD');
  let ticker = stockTickers[tweet.name];
  let stockObj = {name: tweet.name, sentiment: tweet.sentiment, prices: []};

  if (data.symbol === tweet.ticker && moment(data.date).isSame(tweetDate)) {
    stockObj.prices.push({prevPrice: data.close});
    console.log('prev price', data.close);
  }
  if (data.symbol === tweet.ticker && moment(data.date).isSame(tweetFutureDate)) {
    let laterPrice = data.close;
    stockObj.prices.push({laterPrice: data.close});
    console.log('later price', data.close);
  }

  return stockObj;
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
  let baseUrl = 'https://api.aylien.com/api/v1/sentiment?';
  let body = {
          text: newTweetText,
          mode: 'tweet'
        };
  let tweetUrl = baseUrl + queryString.stringify(body);
  let options = {
    method: 'GET',
    uri: tweetUrl,
    headers: {
        'X-AYLIEN-TextAPI-Application-Key': 
        'X-AYLIEN-TextAPI-Application-ID':
    }
  }

  return request(options).then((body) => {
    let result = JSON.parse(body);
    return result.sentiment.label;
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
