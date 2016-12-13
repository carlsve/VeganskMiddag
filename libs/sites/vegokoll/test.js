var scrapeWebsite = require("./index.js");

scrapeWebsite().then(function(log) {
  console.log(log);
  console.log("size: ", log.length);
});
