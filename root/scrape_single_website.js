var DatabasePackage = require('levelup');
var Database = DatabasePackage('./database');

var OpsFromMiddleWare = require('./scrapertool/middleware.js');

const websiteName = process.argv.slice(2);

OpsFromMiddleWare.rawScrapeDataToDbOps(websiteName[0]).then(function(ops) {

  Database.batch(ops, function (err) {
      if (err) { return console.log('Ooops!', err); }
      console.log('All recipes succesfully stored!');
  });
});
