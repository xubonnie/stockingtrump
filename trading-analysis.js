const Promise = require('bluebird');
const sentiment= require('sentiment-analysis');

function getTradingResults(stockObjArr) {
  return new Promise((resolve, reject) => {
    let net = 0;
    for (const stockObj of stockObjArr) {
      let prevPrice = stockObj.prices.prevPrice;
      let laterPrice = stockObj.prices.laterPrice
      if (prevPrice && laterPrice) {
        let diff = sentiment.shouldBuy() ? (laterPrice - prevPrice) : (prevPrice - laterPrice);
        net += diff * 1000;
      }
    }
    resolve(net);
  });
}

module.exports = tradingAnalysis;
