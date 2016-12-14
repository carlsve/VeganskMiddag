// GER DOUBLE CALLBACK, vet ej vad problemet är

var mapping = require("./mapping.json");
var Xray = require("x-ray");
var xray = Xray();

var internals = {
  recipeId: "div",
  recipeNamesId: " a",
  recipeLinksId: "a@href"
};

var scrapeWebsite = () => {

  return new Promise((resolve, reject) => {

    xray(mapping.links[0], internals.recipeId, [{
        recipeName: internals.recipeNamesId,
        recipeLink: internals.recipeLinksId
    }])(function(err, obj) {

      if (err) { reject(err); }
      else { resolve(obj); }
    });
  });
};

module.exports = scrapeWebsite;
