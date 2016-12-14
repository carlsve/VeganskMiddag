var mapping = require("./mapping.json");
var Xray = require("x-ray");
var xray = Xray();

var internals = {
    recipeId: ".product.recipe",
    recipeNamesId: ".prodHeader a",
    recipeLinksId: ".prodHeader a@href"
};

var scrapeWebsite = () => new Promise((resolve, reject) => {
    xray(mapping.links[0], internals.recipeId, [{
        recipeName: internals.recipeNamesId,
        recipeLink: internals.recipeLinksId
    }])((err, obj) => {

        if (err) {
            reject(err);
        }
        resolve(obj);
    });
});

module.exports = scrapeWebsite;
