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
        'X-AYLIEN-TextAPI-Application-Key': 'c06e21cb12fb1afbe7950394af9cfc7f',
        'X-AYLIEN-TextAPI-Application-ID': '0439bce0'
    }
  }

  return request(options).then((body) => {
    return result.polarity;
  }).catch((err) => console.error(err));
}
