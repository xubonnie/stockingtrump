const path = require('path');
const cwd = process.cwd();
const Promise = require('bluebird');
const sentiment = require(path.join(cwd, 'sentiment-analysis'));
const tweet = require(path.join(cwd, 'tweet-analysis'));
const csv = require(path.join(cwd, 'csv-analysis'));
const trading = require(path.join(cwd, 'trading-analysis'));

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
  return Promise.map(tweetsCsvArr[1], (tweet) => {
    return tweet.getStockTweetData(tweet, tweetsCsvArr[0])
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
