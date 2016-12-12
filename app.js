var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var session = require("express-session");
var flash = require("connect-flash");

var routes = require(__dirname + "/routes");

var app = express();
/*
* Mongoose by default sets the auto_reconnect option to true.
* We recommend setting socket options at both the server and replica set level.
* We recommend a 30 second connection timeout because it allows for
* plenty of time in most operating environments.
*/
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
               replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

var mongodbUri = 'mongodb://admin:admin@ds053186.mlab.com:53186/veganrecipes';

mongoose.connect(mongodbUri, options);
app.set("port", process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({
    secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
    resave: true,
    saveUninitialized: true
}));

app.use(flash());
app.use(routes);

app.listen(app.get("port"), function() {
    console.log("Server started on port " + app.get("port"));
});
