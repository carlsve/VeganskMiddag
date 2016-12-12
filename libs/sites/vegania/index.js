var mapping = require("./mapping.json");
var Xray = require("x-ray");
var xray = Xray();

var internals = {
  recipeId: ".receptlista li",
  recipeNamesId: "a",
  recipeLinksId: "a@href"
};

var scrapeWebsite = function() {
  return new Promise(function(resolve, reject) {
    Promise.all(mapping.links.map(url => scrapeLink(url)))
      .then(result => resolve(result.reduce(function(a, b) {
          return a.concat(b); // reduce just merges all arrays of recipes into one array
      })));
  });
};

var scrapeLink = function(url) {
  return new Promise(function(resolve, reject) {

    xray(url, internals.recipeId, [{
        recipeName: internals.recipeNamesId,
        recipeLink: internals.recipeLinksId
    }])(function(err, obj) {
      if (err) { reject(err); }
      else { resolve(obj); }
    });
  });
};


module.exports = scrapeWebsite;
