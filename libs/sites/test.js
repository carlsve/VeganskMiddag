var scraper = require(__dirname + "/scraper");

scraper().then(result => {
  //console.log(result);
  console.log("total amount of recipes: ", result.length);
});
