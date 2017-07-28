const request = require('request-promise');
const queryString = require('query-string');

let baseUrl = 'https://api.aylien.com/api/v1/sentiment?';
let body = {
        text: '.@Macys was one of the worst performing stocks on the S&amp;P last year, plunging 46%. Very disloyal company. Another win for Trump! Boycott.',
        mode: 'tweet'
      };
let tweetUrl = baseUrl + queryString.stringify(body);

const options = {
    method: 'GET',
    uri: tweetUrl,
    headers: {
        'X-AYLIEN-TextAPI-Application-Key': 'c06e21cb12fb1afbe7950394af9cfc7f',
        'X-AYLIEN-TextAPI-Application-ID': '0439bce0'
    }
};

request(options)
    .then(function (parsedBody) {
      console.log(parsedBody);
    })
    .catch(function (err) {
      console.log(err);
        // POST failed...
    });


	// https://api.aylien.com/api/v1/sentiment?text=hello%20i%20love%20you
