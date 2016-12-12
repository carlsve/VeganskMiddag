var available = require(__dirname + "/available-sites.json");
var sites = available["available-sites"];

/*
This horrible chain of map functions calls each [sitename]/index.js, where
[sitename] is from available-sites.json.

for each site, every recipe name/link/[sitename] is scraped and gathered.

Promise.all(...) function scrapes every site, and then calls ".then"
after ALL of them are done.

The recipeData is an array of all arrays of recipeobjects scraped from each website
So we resolve a concatenated array.

like so [[koketrecipes...], [matklubbenrecipes...]]
-> [koketrecipes..., matklubbenrecipes...]
*/

/*
scrapeRecipes scrapes all websites that are available and
returns a recipeData array of recipe objects.
*/
var scrapeRecipes = () => new Promise((resolve, reject) => {

    Promise.all(sites.map(site => scrape(site)))
        .then(recipeData => resolve(recipeData.reduce((a, b) => a.concat(b)) // reduce just merges all arrays of recipes into one array
        ));
});

/*
This scrapes one website for vegan recipes.
scrapeSite() returns an array of recipe-objects and
returns the result
*/
function scrape(site) {
    var scrapeSite = require(__dirname + "/" + site + "/index");
    return scrapeSite().then(result => {
        result = result.map(recipe => {
            recipe.site = site;
            return recipe;
        });
        console.log("scraped ", result.length, " recipes from ", site);
        return result;
    });
}

module.exports = scrapeRecipes;
