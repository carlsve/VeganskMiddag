var testLog = require("./index.js");

testLog.scrapeWebsite().then(function(err, log) {
  if (err) { console.log(err); }
  console.log(log);
})
