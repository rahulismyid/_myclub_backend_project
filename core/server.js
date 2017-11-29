var db = require("../core/db");
var http = require("http");
var admin = require('../controllers/admin');
var httpmsgs = require("./httpMsgs");
var settings = require('../settings');
var regex = require('node-regexp');
var url = require('url');
var express = require('express'),
    assert = require('assert'),
    bodyParser = require('body-parser'),
    ObjectId = require('mongodb').ObjectID,
    app = express(),
    token = "";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//get home
app.get('/', function (req, res, next) {
    if (settings.httpMsgsFormat === "HTML") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write("<html><head><title>HOME</title></head><body>Valid End Points: <br> / - GET - Home.<br> /allplaces - GET - To List all PLACES. <br>/allevents - GET - To list all EVENTS.<br>/entertainment - GET - To list places with any EVENTS or ENTERTAINMENT HAPPENINGS .<br>/eventcal - GET - To list all upcoming events(from today onwards).<br>/entertainment/'category' - GET - To list places by category(Eg: bar, nightclub..). </body> </html>");
        res.end();
    }
    else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify([
            { url: "/employees", operation: "GET", description: "To List all employees." },
            { url: "/employees/<empNo>", operation: "GET", description: "To search an employee." }
        ]));
    }
});

//get data for events
app.get('/api/getAllEventsData', function (req, res, next) {
    admin.getDataForEvents(req, res);
});

//get data for places
app.get('/api/getAllPlacesData', function (req, res, next) {
    admin.getDataForPlaces(req, res);
});

//get login
app.post('/api/login', function (req, res, next) {
    admin.getLogin(req, res);
});

//get login
app.post('/api/logout', function (req, res, next) {
    admin.getLogout(req, res);
});

//get method
app.get('/api/records', function (req, res, next) {
    token = parseCookies(req);
    if (token) {
        var jwt = require('jsonwebtoken');
        jwt.verify(token, 'secret', function (err, data) {
            if (err) {
                httpmsgs.show403(req, res);
            } else {
                admin.getRecords(req, res);
            }
        });
    } else {
        httpmsgs.show403(req, res);
    }
    token = "";
});

//get method
app.get('/api/getEvents', function (req, res, next) {
    token = parseCookies(req);
    if (token) {
        var jwt = require('jsonwebtoken');
        jwt.verify(token, 'secret', function (err, data) {
            if (err) {
                httpmsgs.show403(req, res);
            } else {
                admin.getDataGTtodayForEvent(req, res);
            }
        });
    } else {
        httpmsgs.show403(req, res);
    }
    token = "";
});

app.get('/api/records/:id', function (req, res, next) {
    var id = req.params.id;
    admin.deleteRecords(req, res, id);
});

//post method
app.post('/api/postRecords', function (req, res, next) {
    admin.postRecords(req, res);
});

//delete method
app.delete('/api/records/:id', function (req, res, next) {
    var id = req.params.id;
    console.log("Delete " + id);
    records_collection.deleteOne({ '_id': new ObjectId(id) }, function (err, results) {
        console.log(results);
        res.json(results);
    });
});

//update method
app.put('/api/records/:id', function (req, res, next) {
    admin.postRecords(req, res);
});


app.use(function (req, res, next) {

});

/********************************************

    app.get('/api', function (req, res) {
        res.json({
            txt: 'my_text'
        })
    });


    app.get('/api/protected', ensureToken, function (req, res) {
        jwt.verify(req.token, 'my_key', function (err, data) {
            if (err) {
                res.sendStatus(403);
            } else {
                res.json({
                    txt: 'this is protected',
                    data: data
                });
            }
        });
    });

    function ensureToken(req, res, next) {
        const bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];
            req.token = bearerToken;
            next();
        } else {
            res.send('Forbidden');
        }
    }

    var jwt = require('jsonwebtoken');

    app.post('/api/login', function (req, res) {
        const user = { id: 3 };
        const token = jwt.sign({ user }, 'my_key');

        res.json({
            token: token
        });
    });
*/

/**
 * Function to get cookies from browser and split it into name and value.
 */
function parseCookies(request) {
    var list = {},
        rc = request.headers.cookie, _cookie;

    rc && rc.split(';').forEach(function (cookie) {
        var parts = cookie.split('=');
        _cookie = parts[1];
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return _cookie;
}

var server = app.listen(process.env.PORT || 3200, function () {
    var port = server.address().port;
    console.log('Server on %s.', port)
});
