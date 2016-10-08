/**
  * A setup that is put in
  */

var levelup = require('levelup')
var Database = levelup('./database')

var siteList = [];
var amountOfScrapedRecipes = 0;

Database.createReadStream()
    .on('data', function(data) {
        if (data['key'].includes("recipeamt")) {
          siteList.push(data['key']);
        }
        if (data['key'].includes("numberofrecipes") || data['key'].includes("sitelist")) {
          console.log(data.key + ": " + data.value);
        }
    })
    .on('close', function () {
      var index = siteList.length;

      for (var key in siteList) {
        Database.get(siteList[key], function(err, amount) {
          amountOfScrapedRecipes += parseInt(amount, 10);
          if (index == 0) {
            Database.put('numberofrecipes', amountOfScrapedRecipes, function(err) {
              Database.put('sitelist', siteList, function(err) {
                console.log("successfull storage!");
                Database.close();
              });
            });
          }
          index -= 1;
        });
      }
    });
