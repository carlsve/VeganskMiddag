var mapping = require("./mapping.json");
var Xray = require("x-ray");
var _ = require("underscore");

var xray = Xray();

var internals = {
    paginate: "li.pager-next a@href",
    recipeId: ".title",
    recipeNamesId: "a",
    recipeLinksId: "a@href"
};

var scrapeWebsite = () => new Promise((resolve, reject) => {

    Promise.all(_.range(28).map(pageindex => scrapePage("http://www.vegokoll.se/recept?page=" + pageindex + "&tid=50"))).then(result => {
        resolve(result.reduce((a, b) => a.concat(b)));
    });
});

function scrapePage(url) {
    return new Promise((resolve, reject) => {
        xray(url, internals.recipeId, [{
            recipeName: internals.recipeNamesId,
            recipeLink: internals.recipeLinksId
        }])((err, obj) => {
            if (err) {
                reject(err);
            }
            resolve(obj);
        });
    });
}

module.exports = scrapeWebsite;
