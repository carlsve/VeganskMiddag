var scraper = require(__dirname + "/scraper");

scraper().then(function(result) {
  console.log(result);
});
