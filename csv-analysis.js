const Promise = require('bluebird');
const csvFilePath = 'prices-split-adjusted.csv';
const csv = require('csvtojson');

exports.filterCsv = function(tweets) {
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
