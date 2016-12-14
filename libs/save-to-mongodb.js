var mongoose = require("mongoose");


var Recipe = require(__dirname + "/../model/recipe-model");
var scraper = require(__dirname + "/sites/scraper");

/*
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for
 * plenty of time in most operating environments.
 */
var options = {
    server: {
        socketOptions: {
            keepAlive: 300000,
            connectTimeoutMS: 30000
        }
    },
    replset: {
        socketOptions: {
            keepAlive: 300000,
            connectTimeoutMS: 30000
        }
    }
};

var mongodbUri = 'mongodb://admin:admin@ds053186.mlab.com:53186/veganrecipes';

mongoose.connect(mongodbUri, options);

scraper().then(recipeData => {
    let fails = 0;
    const batch = recipeData
        .map(recipe => schemifyData(recipe))
        .map(recipe => new Promise((resolve, reject) => recipe.save(err => {
            if (err) {
                fails += 1;
                resolve();
            } else {
                resolve();
            }
        })));
    return Promise.all(batch)
        .then(() => {
            console.log(fails, "failed saves. This is usually because of 'duplicate' entries, and should therefore be ignored.");
            process.exit();
        })
        .catch((err) => {
            console.error('save error', err);
            process.exit();
        });
});

function schemifyData(recipe) {
    return new Recipe({
        name: recipe.recipeName,
        url: recipe.recipeLink,
        site: recipe.site
    });
}
