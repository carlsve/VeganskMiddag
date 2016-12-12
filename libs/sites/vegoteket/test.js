var scrapeWebsite = require("./index.js");

scrapeWebsite().then(function(err, log) {
  if (err) { console.log(err); }
  console.log(log);
})
