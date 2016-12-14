var scrapeWebsite = require("./index.js");

scrapeWebsite().then(log => {
  console.log(log);
  console.log(log.length, " recipes scraped.");
});
