const Promise = require('bluebird');
const path = require('path');
// const tweetData = require(path.join(process.cwd(), 'trump-tweet-data2'));

function getCompanyTweets(tweetData) {
  let textArr = [];
  let mentioned = [];
  let companies = ['nordstrom', 'general motors', ,'boeing', 'apple', 'macy', 't-mobile'];
  let max_id = tweetData[tweetData.length-1].id;
  console.log(max_id);

  for (const tweet of tweetData) {
    textArr.push(tweet.text);
  }
  for (const text of textArr) {
    for (const c of companies) {
      if (text.toLowerCase().includes(c)) {
        mentioned.push(text);
      }
    }
  }
  console.log(mentioned);
  return max_id;
}

module.exports = getCompanyTweets;

// function getCompanyTweets(tweetData) {
//   let textArr = [];
//   let mentioned = [];
//   let companies = ['nordstrom', 'general motors', ,'boeing', 'apple', 'macy\'s', 't-mobile'];
//   let max_id = tweetData[tweetData.length-1].id;
//
//   for (const tweet of tweetData) {
//     textArr.push(tweet.text);
//   }
//   for (const text of textArr) {
//     console.log(text);
//     for (const c of companies) {
//       if (text.toLowerCase().includes(c)) {
//         mentioned.push(text);
//       }
//     }
//   }
//   console.log(mentioned);
//   return max_id;
// }
//
// let max_id = getCompanyTweets(tweetData);
// console.log(max_id);
