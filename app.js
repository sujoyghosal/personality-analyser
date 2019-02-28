/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

var personalityInsights = new PersonalityInsightsV3({
    version: '2019-02-28',
    iam_apikey: 'JwzDifZKOCyUc_TQzJXbPB0xUo9gPcu_Au54zEogBbU6',
    url: 'https://gateway.watsonplatform.net/personality-insights/api'
});

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
};
// create a new express server
var app = express();
app.use(allowCrossDomain);
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var url = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
app.get('/', function(req, resp) {
    var out = "Hey, are you looking for something?";
    out += "  Use /personality?text=<content>";
    resp.jsonp(out);
});
app.get('/personality', function(req, res) {
    var text = req.param('text');
    var params = {
        "text": text
    }
    personalityInsights.profile({
            text: text,
            consumption_preferences: true
        },
        function(err, response) {
            if (err) {
                console.log(err);
                res.jsonp(err);
            } else
                res.jsonp(response);
        });
});

// start server on the specified port and binding host
app.listen(port, '0.0.0.0', function() {
    // print a message when the server starts listening
    console.log("server starting on " + url);
});