var middleware = require("./middleware.js");

const websiteName = process.argv.slice(2);
console.log(websiteName[0]);
middleware.rawScrapeDataToDbOps(websiteName[0]).then(function(results) {
  console.log(results);
});
