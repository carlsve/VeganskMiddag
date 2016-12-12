var testLog = require("./index.js");

testLog.scrapeWebsite().then(function(log) {
  console.log(log);
})
