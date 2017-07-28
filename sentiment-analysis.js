const Promise = require('bluebird');
const request = require('request-promise');
const tweetAnalysis = require('tweet-analysis');

let api = {
  getSentiment(tweet) {
    let newTweetText = tweetAnalysis.removeRT(tweet.text);
    let options = {
      method: 'POST',
      uri: 'http://text-processing.com/api/sentiment/',
      form: {
          text: newTweetText
      }
    };
    return request(options)
      .then((body) => {
        let sentiment = JSON.parse(body);
        return sentiment.label;
    })
      .catch((err) => console.error(err));
  }
};

exports.addSentiment = function(tweet) {
  return new Promise((resolve, reject) => {
    api.getSentiment(tweet)
    .then((label) => {
      tweet.sentiment = label
      resolve(tweet);
    })
    .catch((err) => {
      reject(err);
    });
  });
}

exports.shouldBuy = function(sentiment) {
  if (sentiment === 'pos') {
    return true;
  }
  return false;
}
