const path = require('path');
const Promise = require('bluebird');
const sentiment = require('./sentiment-analysis');
const tweet = require('./tweet-analysis');
const csv = require('./csv-analysis');
const trading = require('./trading-analysis');

tweet.getTweets()
.then((tweetsArr) => {
  return Promise.map(tweetsArr, (tweet) => {
    return sentiment.addSentiment(tweet);
  });
})
.then((tweets) => {
  return csv.filterCsv(tweets);
})
.then((tweetsCsvArr) => {
  return Promise.map(tweetsCsvArr[1], (eachTweet) => {
    return tweet.getStockTweetData(eachTweet, tweetsCsvArr[0])
  });
})
.then((stockObjArr) => {
  return trading.getTradingResults(stockObjArr);
})
.then((net) => {
  console.log('You would\'ve made', `$${net.toFixed(2)}`);
})
.catch((err) => {
  console.error(err);
})
