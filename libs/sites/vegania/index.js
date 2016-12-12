var mapping = require("./mapping.json");
var Xray = require("x-ray");
var xray = Xray();

var internals = {
  recipeId: ".receptlista li",
  recipeNamesId: "a",
  recipeLinksId: "a@href"
}

var index = mapping.links.length;

var scrapeWebsite = function() {
  return new Promise(function(resolve, reject) {
    var obj = scrapeLink(index).then(function(result) {
      index -= 1;
      if (index == 0) {
        resolve(result);
      }
      else {
        resolve(result.concat(scrapeWebsite(index)));
      }
    })
  });
}

var scrapeLink = function(index) {
  return new Promise(function(resolve, reject) {

    xray(mapping.links[index], internals.recipeId, [{
        recipeName: internals.recipeNamesId,
        recipeLink: internals.recipeLinksId
    }])(function(err, obj) {
      if (err) { reject(err); }
      else { resolve(obj); }
    });
  });
}


module.exports.scrapeWebsite = scrapeWebsite;
