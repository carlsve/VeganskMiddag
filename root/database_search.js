var levelup = require('levelup')
var Database = levelup('./database')

var siteList = [];
var amountOfScrapedRecipes = 0;

Database.createReadStream()
    .on('data', function(data) {
        if (data['key'].includes("recipeamt")) {
          siteList.push(data['key']);
        }
        console.log(data);
    })
    .on('close', function () {
      console.log(siteList);

      for (var key in siteList) {
        Database.get(siteList[key], function(err, amount) {
          amountOfScrapedRecipes += parseInt(amount, 10);
          Database.put("numberofrecipes", amountOfScrapedRecipes, function(err) {
            console.log("Successfully stored number of recipes: " + amountOfScrapedRecipes);
          });
        });
      }

      Database.close();
    });
