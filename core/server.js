var db = require("../core/db");
var http = require("http");
var admin = require('../controllers/admin');
var httpmsgs = require("./httpMsgs");
var settings = require('../settings');
var regex = require('node-regexp');
var Gallery = require('express-photo-gallery');
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
var jwt = require('jsonwebtoken');
var express = require('express'),
    assert = require('assert'),
    bodyParser = require('body-parser'),
    ObjectId = require('mongodb').ObjectID,
    app = express(),
    token = "";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


/************************** Admin routes start's.**************************/

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

//get method.
app.post('/api/admin/getLoginForAdmin', function (req, res) {
    token = parseCookies(req);
    console.log(token);
    if (token) {
        jwt.verify(token.trim(), 'secret', function (err, data) {
            if (err) {
                httpmsgs.show403(req, res);
            } else {
                res.clearCookie();
                admin.getLoginForAdmin(req, res);
            }
        });
    } else if (!token.trim()) {
        console.log('Redirect to login page');
        res.end('Redirect to login page');
    } else {
        console.log('here');
        httpmsgs.show403(req, res);
    }
    token = "";
});

//get method.
app.post('/api/getLogoutForAdmin', function (req, res, next) {
    admin.getLogoutForAdmin(req, res);
});

/***Place Details API's start***/
//get method
app.get('/api/admin/getPlaceDetailsForAdmin', function (req, res, next) {
    token = parseCookies(req);
    if (token) {
        var jwt = require('jsonwebtoken');
        jwt.verify(token, 'secret', function (err, data) {
            if (err) {
                httpmsgs.show403(req, res);
            } else {
                admin.getPlaceDetailsForAdmin(req, res);
            }
        });
    } else {
        httpmsgs.show403(req, res);
    }
    token = "";
});

//get method
//Needs a parameter (objectID) for GET.
app.get('/api/admin/getSinglePlaceDetailsForAdmin/:id', function (req, res, next) {
    var id = req.params.id;
    token = parseCookies(req);
    if (token) {
        var jwt = require('jsonwebtoken');
        jwt.verify(token, 'secret', function (err, data) {
            if (err) {
                httpmsgs.show403(req, res);
            } else {
                admin.getSinglePlaceDetailsForAdmin(req, res, id);
            }
        });
    } else {
        httpmsgs.show403(req, res);
    }
    token = "";
});

//post method.
//Adding new place to db.
app.post('/api/admin/addPlaceDetailsForAdmin', function (req, res, next) {
    token = parseCookies(req);
    console.log(token);
    if (token) {
        jwt.verify(token.trim(), 'secret', function (err, data) {
            if (err) {
                httpmsgs.show403(req, res);
            } else {
                res.clearCookie();
                admin.addPlaceDetailsForAdmin(req, res);
            }
        });
    } else if (!token.trim()) {
        console.log('Redirect to login page');
        res.end('Redirect to login page');
    } else {
        console.log('here');
        httpmsgs.show403(req, res);
    }
    token = "";
});

//delete method
//Needs a parameter (objectID) for post.
app.delete('/api/admin/deletePlaceDetailsForAdmin/:id', function (req, res, next) {
    var id = req.params.id;
    token = parseCookies(req);
    console.log(token);
    if (token) {
        jwt.verify(token.trim(), 'secret', function (err, data) {
            if (err) {
                httpmsgs.show403(req, res);
            } else {
                res.clearCookie();
                admin.deletePlaceDetailsForAdmin(req, res, id);
            }
        });
    } else if (!token.trim()) {
        console.log('Redirect to login page');
        res.end('Redirect to login page');
    } else {
        console.log('here');
        httpmsgs.show403(req, res);
    }
    token = "";
});

//update method
//Needs a parameter (objectID) for put.
app.put('/api/admin/updatePlaceDetailsForAdmin/:id', function (req, res, next) {
    var id = req.params.id;
    token = parseCookies(req);
    console.log(token);
    if (token) {
        jwt.verify(token.trim(), 'secret', function (err, data) {
            if (err) {
                httpmsgs.show403(req, res);
            } else {
                res.clearCookie();
                admin.updatePlaceDetailsForAdmin(req, res, id);
            }
        });
    } else if (!token.trim()) {
        console.log('Redirect to login page');
        res.end('Redirect to login page');
    } else {
        console.log('here');
        httpmsgs.show403(req, res);
    }
    token = "";
});
/***Place Details API's end***/

/***Event Details API's start***/
//get method
app.get('/api/admin/getEventDetailsForAdmin', function (req, res, next) {
    token = parseCookies(req);
    if (token) {
        var jwt = require('jsonwebtoken');
        jwt.verify(token, 'secret', function (err, data) {
            if (err) {
                httpmsgs.show403(req, res);
            } else {
                admin.getEventDetailsForAdmin(req, res);
            }
        });
    } else {
        httpmsgs.show403(req, res);
    }
    token = "";
});

//get method
//Needs a parameter (objectID) for GET.
app.get('/api/admin/getSingleEventDetailsForAdmin/:id', function (req, res, next) {
    var id = req.params.id;
    token = parseCookies(req);
    if (token) {
        var jwt = require('jsonwebtoken');
        jwt.verify(token, 'secret', function (err, data) {
            if (err) {
                httpmsgs.show403(req, res);
            } else {
                admin.getSingleEventDetailsForAdmin(req, res, id);
            }
        });
    } else {
        httpmsgs.show403(req, res);
    }
    token = "";
});

//post method.
//Adding new place to db.
app.post('/api/admin/addEventDetailsForAdmin', function (req, res, next) {
    token = parseCookies(req);
    console.log(token);
    if (token) {
        jwt.verify(token.trim(), 'secret', function (err, data) {
            if (err) {
                httpmsgs.show403(req, res);
            } else {
                res.clearCookie();
                admin.addEventDetailsForAdmin(req, res);
            }
        });
    } else if (!token.trim()) {
        console.log('Redirect to login page');
        res.end('Redirect to login page');
    } else {
        console.log('here');
        httpmsgs.show403(req, res);
    }
    token = "";
});

//delete method
//Needs a parameter (objectID) for post.
app.delete('/api/admin/deleteEventDetailsForAdmin/:id', function (req, res, next) {
    var id = req.params.id;
    token = parseCookies(req);
    console.log(token);
    if (token) {
        jwt.verify(token.trim(), 'secret', function (err, data) {
            if (err) {
                httpmsgs.show403(req, res);
            } else {
                res.clearCookie();
                admin.deleteEventDetailsForAdmin(req, res, id);
            }
        });
    } else if (!token.trim()) {
        console.log('Redirect to login page');
        res.end('Redirect to login page');
    } else {
        console.log('here');
        httpmsgs.show403(req, res);
    }
    token = "";
});

//update method
//Needs a parameter (objectID) for put.
app.put('/api/admin/updateEventDetailsForAdmin/:id', function (req, res, next) {
    var id = req.params.id;
    token = parseCookies(req);
    console.log(token);
    if (token) {
        jwt.verify(token.trim(), 'secret', function (err, data) {
            if (err) {
                httpmsgs.show403(req, res);
            } else {
                res.clearCookie();
                admin.updateEventDetailsForAdmin(req, res, id);
            }
        });
    } else if (!token.trim()) {
        console.log('Redirect to login page');
        res.end('Redirect to login page');
    } else {
        console.log('here');
        httpmsgs.show403(req, res);
    }
    token = "";
});

//get method
app.get('/api/admin/getPastEventDetailsForAdmin', function (req, res, next) {
    token = parseCookies(req);
    if (token) {
        var jwt = require('jsonwebtoken');
        jwt.verify(token, 'secret', function (err, data) {
            if (err) {
                httpmsgs.show403(req, res);
            } else {
                admin.getPastEventDetailsForAdmin(req, res);
            }
        });
    } else {
        httpmsgs.show403(req, res);
    }
    token = "";
});

//get method
app.get('/api/admin/getUpcomingEventDetailsForAdmin', function (req, res, next) {
    token = parseCookies(req);
    if (token) {
        var jwt = require('jsonwebtoken');
        jwt.verify(token, 'secret', function (err, data) {
            if (err) {
                httpmsgs.show403(req, res);
            } else {
                admin.getUpcomingEventDetailsForAdmin(req, res);
            }
        });
    } else {
        httpmsgs.show403(req, res);
    }
    token = "";
});
/***Event Details API's end***/


/************************** Admin routes End's.**************************/

//get method.
/* Get Place details - home page. */
app.get('/api/getPlaceDetailsForHomePage', function (req, res, next) {
    admin.getPlaceDetailsForHomePage(req, res);
});

//get method.
/* Get One Place detail - home page. */
//Needs a parameter (objectID) for get.
app.get('/api/getOnePlaceDetailForHomePage/:id', function (req, res, next) {
    var id = req.params.id;
    admin.getOnePlaceDetailForHomePage(req, res, id);
});

//get method.
/* Get events happening at a place. */
//Needs a parameter (objectID) for get.
app.get('/api/getEventsHappeningAtPlace/:id', function (req, res, next) {
    var id = req.params.id;
    admin.getEventsHappeningAtPlace(req, res, id);
});

//get method.
/* Get Event details - home page. */
app.get('/api/getEventDetailsForHomePage', function (req, res, next) {
    admin.getEventDetailsForHomePage(req, res);
});

//get method.
/* Get Upcoming Event details - home page. */
app.get('/api/getUpcomingEventDetails', function (req, res, next) {
    admin.getUpcomingEventDetails(req, res);
});

//get method.
/* Get One Event detail - home page. */
//Needs a parameter (objectID) for get.
app.get('/api/getOneEventDetailForHomePage/:id', function (req, res, next) {
    var id = req.params.id;
    admin.getOneEventDetailForHomePage(req, res, id);
});

//get method.
/* Get Bar details - home page. */
app.get('/api/getBarDetailsForHomePage', function (req, res, next) {
    admin.getBarDetailsForHomePage(req, res);
});

//get method.
/* Get One Event detail - home page. */
//Needs a parameter (objectID) for get.
app.get('/api/getOneBarDetailForHomePage/:id', function (req, res, next) {
    var id = req.params.id;
    admin.getOneBarDetailForHomePage(req, res, id);
});

//get method.
/* Get Entertainment Place - home page. */
app.get('/api/getEntertainmentPlaceDetailsForHomePage', function (req, res, next) {
    admin.getEntertainmentPlaceDetailsForHomePage(req, res);
});

//get method.
/* Get One Entertainment Place detail - home page. */
//Needs a parameter (objectID) for get.
app.get('/api/getOneEntertainmentPlaceDetailsForHomePage/:id', function (req, res, next) {
    var id = req.params.id;
    admin.getOneEntertainmentPlaceDetailsForHomePage(req, res, id);
});

//get method.
/* Get NightClub - home page. */
app.get('/api/getNightClubDetailsForHomePage', function (req, res, next) {
    admin.getNightClubDetailsForHomePage(req, res);
});

//get method.
/* Get One NightClub detail - home page. */
//Needs a parameter (objectID) for get.
app.get('/api/getOneNightClubDetailsForHomePage/:id', function (req, res, next) {
    var id = req.params.id;
    admin.getOneNightClubDetailsForHomePage(req, res, id);
});

//get method.
/* Get Restaurent - home page. */
app.get('/api/getRestaurentDetailsForHomePage', function (req, res, next) {
    admin.getRestaurentDetailsForHomePage(req, res);
});

//get method.
/* Get One Restaurent detail - home page. */
//Needs a parameter (objectID) for get.
app.get('/api/getOneRestaurentDetailsForHomePage/:id', function (req, res, next) {
    var id = req.params.id;
    admin.getOneRestaurentDetailsForHomePage(req, res, id);
});

//post method.
//user registeration || check if user is already logged in.
app.post('/api/userRegisteration', function (req, res, next) {
    token = parseCookies(req);
    console.log(token);
    if (token) {
        jwt.verify(token.trim(), 'secret', function (err, data) {
            if (err) {
                httpmsgs.show403(req, res);
            } else {
                res.clearCookie();
                admin.userRegisteration(req, res);
            }
        });
    } else if (!token.trim()) {
        console.log('Redirect to login page');
        res.end('Redirect to login page');
    } else {
        console.log('here');
        httpmsgs.show403(req, res);
    }
    token = "";
});

//post method.
//handling going, not going, maybe event.
app.post('/api/goingNotgoingMaybe', function (req, res, next) {
    token = parseCookies(req);
    if (token) {
        jwt.verify(token.trim(), 'secret', function (err, data) {
            if (err) {
                httpmsgs.show403(req, res);
            } else {
                res.clearCookie();
                admin.goingNotgoingMaybe(req, res);
            }
        });
    } else if (!token.trim()) {
        console.log('Redirect to login page');
        res.end('Redirect to login page');
    } else {
        console.log('here');
        httpmsgs.show403(req, res);
    }
    token = "";
});

//get method.
//handling going, not going, maybe event.
app.use('/api/photos', Gallery('./images', options));
var options = {
    title: 'My Awesome Photo Gallery'
};


app.get('/api/eventPhotography', function (req, res, next) {
    admin.eventPhotography(req, res);
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
