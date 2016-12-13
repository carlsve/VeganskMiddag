var mapping = require("./mapping.json");
var Xray = require("x-ray");
var xray = Xray();

var internals = {
    paginate: "li.pager-next a@href",
    recipeId: ".title",
    recipeNamesId: "a",
    recipeLinksId: "a@href"
};

var scrapeWebsite = () => new Promise((resolve, reject) => {

    xray(mapping.links[0], internals.paginate)((err, obj) => {
        console.log(obj, obj.substring(35, 36));
    });

    xray(mapping.links[0], internals.recipeId, [{
        recipeName: internals.recipeNamesId,
        recipeLink: internals.recipeLinksId
    }]).paginate(internals.paginate)((err, obj) => {
        if (err) {
            reject(err);
        }

        resolve(obj);
    });
});

module.exports = scrapeWebsite;
