var mongoose = require("mongoose");
var random = require('mongoose-simple-random');

/*
recipeSchema is a data model for the mongodb storage.
- id should start at 0 and increment for every save
TODO: id should probably not be used, read up on gettig random database element
      methods that are already in the mongodb api.
- name the name of the recipe
- url the web adress to the recipe
- site the site the recipe is scraped from (example: "koket")
- scrapedAt the date when the links was scraped
*/
var recipeSchema = mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  site: { type: String, require: true },
  createdAt: { type: Date, default: Date.now }
});

/*
getRecipe returns data from mongodb storage,
in the form of:
- name the name of the recipe
- url the web adress to the recipe
- site the site the recipe is scraped from (example: "koket")
*/
recipeSchema.methods.getRecipe = function () {
  return { name: this.name,
    url: this.url,
    site: this.site
  };
};

recipeSchema.plugin(random);

var Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
