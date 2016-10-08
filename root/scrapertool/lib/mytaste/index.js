// GER DOUBLE CALLBACK, vet ej vad problemet är

var mapping = require("./mapping.json");
var Xray = require("x-ray");
var xray = Xray();

var internals = {
  recipeId: ".recipe_card",
  recipeNamesId: ".recipe-card__title p",
  recipeLinksId: "@data-url"
}

var scrapeWebsite = function() {

  return new Promise(function(resolve, reject) {

    xray(mapping["links"][0], [{
        recipeName: internals.recipeNamesId,
        recipeLink: internals.recipeLinksId
    }])(function(err, obj) {

      if (err) { reject(err); }

      resolve(obj);
    })
  });
}

module.exports.scrapeWebsite = scrapeWebsite;
