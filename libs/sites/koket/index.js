var mapping = require(__dirname + "/mapping.json");
var Xray = require("x-ray");
var xray = Xray();

var internals = {
    recipeId: "article",
    recipeNamesId: "a img@alt",
    recipeLinksId: "a@href"
};

var scrapeWebsite = () => new Promise(function(resolve, reject) {

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
