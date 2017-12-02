var httpmsgs = require("../core/httpMsgs");
var def = require("../core/definations");
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/newList';
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');


var bar = 'bar', place = 'place',
    entertainment = 'entertainment',
    restaurent = 'restaurent',
    nightclub = 'nightclub',
    event = 'event',
    category = 'category',
    _id = '_id';


MongoClient.connect(process.env.MONGODB_URL || url, function (err, db) {
    assert.equal(null, err);
    console.log('Successfully connected to Mongodb.');

    /* Admin Panel API's start. */

    exports.getLoginForAdmin = function (req, resp) {
        var uname = req.body.username;
        var pass = req.body.password;
        var hashedPass;

        //db.admin.find({$where: "this.username = 'admin'"})
        //{ username: { $eq: uname }, password: { $eq: hashedPass } 
        db.collection(def.admin_col).find({ $where: "this.username = '" + uname + "'" }).toArray(function (err, records) {
            var bcrypt = require('bcryptjs');

            bcrypt.compare(pass, records[0].password, function (err, res) {
                if (err) {
                    httpmsgs.show500(req, resp, err);
                    console.log(' cannot login');
                }
                else if (res === true) {
                    var user = { name: uname }; //!! find the user and check user from db then
                    var token = jwt.sign(user, 'secret');
                    resp.cookie('myToken', token);
                    // resp.cookie('myToken', token, { maxAge: 10000 });
                    console.log(req.headers.cookie);
                    resp.end('Login Successful');
                } else {
                    resp.end('Invalid Username or Password.');
                }
            });
        });
    };

    exports.getLogoutForAdmin = function (req, resp) {
        resp.cookie('myToken', token, { maxAge: 10000 });
        resp.clearCookie("myToken");
        resp.end('Logout Successful');
    };

    /* ------------------------------------------------------------------ */

    exports.getPlaceDetailsForAdmin = function (req, resp) {
        // find( { name: { $eq : "John" } } )
        db.collection(def.place_col).find({}).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    //Needs a parameter (objectID) for GET.
    exports.getSinglePlaceDetailsForAdmin = function (req, resp) {
        // find( { name: { $eq : "John" } } )
        db.collection(def.place_col).find({ _id: new ObjectId(id) }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    exports.addPlaceDetailsForAdmin = function (req, resp) {
        db.collection(def.place_col).insert(req.body, function (err, doc) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            else {
                httpmsgs.sendJSON(req, resp, doc);
            }
        });
    };

    //Needs a parameter (objectID) for delete.
    exports.deletePlaceDetailsForAdmin = function (req, resp, _id) {
        db.collection(def.place_col).deleteOne({ _id: new ObjectId(_id) }, function (err, results) {
            console.log(results);
            res.json(results);
        });
        resp.end();
    };

    //Needs a parameter (objectID) for update.
    exports.updatePlaceDetailsForAdmin = function (req, resp, id) {
        db.collection(def.place_col).updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    'name': req.body.name,
                    'email': req.body.email,
                    'number': req.body.number
                }
            },
            function (err, results) {
                console.log(results);
                res.json(results);
            });
        resp.end();
    };

    /* ------------------------------------------------------------------ */

    exports.getEventDetailsForAdmin = function (req, resp) {
        // find( { name: { $eq : "John" } } )
        db.collection(def.event_col).find({}).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    //Needs a parameter (objectID) for GET.
    exports.getSingleEventDetailsForAdmin = function (req, resp, _id) {
        // find( { name: { $eq : "John" } } )
        db.collection(def.event_col).find({ _id: new ObjectId(_id) }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    exports.addEventDetailsForAdmin = function (req, resp) {
        db.collection(def.event_col).insert(req.body, function (err, doc) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            else {
                httpmsgs.sendJSON(req, resp, doc);
            }
        });
    };

    //Needs a parameter (objectID) for delete.
    exports.deleteEventDetailsForAdmin = function (req, resp, _id) {
        db.collection(def.event_col).deleteOne({ _id: new ObjectId(_id) }, function (err, results) {
            console.log(results);
            res.json(results);
        });
        resp.end();
    };

    //Needs a parameter (objectID) for update.
    exports.updateEventDetailsForAdmin = function (req, resp, _id) {
        db.collection(def.event_col).updateOne(
            { _id: new ObjectId(_id) },
            {
                $set: {
                    'name': req.body.name,
                    'email': req.body.email,
                    'number': req.body.number
                }
            },
            function (err, results) {
                console.log(results);
                res.json(results);
            });
        resp.end();
    };

    exports.getPastEventDetailsForAdmin = function (req, resp) {
        db.collection(def.event_col).find({ "date": { $lt: new Date() } }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    exports.getUpcomingEventDetailsForAdmin = function (req, resp) {
        db.collection(def.event_col).find({ "date": { $gt: new Date() } }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };
    /* ------------------------------------------------------------------ */

    /* Admin Panel API's end. */

    /* Get home page. */
    /* Not in use ↓ */
    exports.getHomePage = function (req, resp) {
        db.collection(def.place_col).find({ $and: [{ category: { $eq: place } }] }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    /* Get Place details - home page. */
    exports.getPlaceDetailsForHomePage = function (req, resp) {
        //find( { '_id': new ObjectId(id) } )
        db.collection(def.place_col).find({ $and: [{ category: { $eq: place } }] }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    /* Get One Place detail - home page. */
    exports.getOnePlaceDetailForHomePage = function (req, resp, _id) {
        // find({ $and:[ {_id: {$eq: new ObjectId(_id)}},{category: {$eq: ""}}]})
        db.collection(def.place_col).find({ $and: [{ _id: { $eq: new ObjectId(_id) } }, { category: { $eq: place } }] }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    /* get events happening at a place. */
    exports.getEventsHappeningAtPlace = function (req, resp, _id) {
        // find({ $and:[ {"category": {$eq: ""}},{"email": {$eq: ""}}]})
        db.collection(def.place_col).find({ $and: [{ category: { $eq: "event" } }, { _id: { $eq: new ObjectId(_id) } }] }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    /* Get Event details - home page. */
    exports.getEventDetailsForHomePage = function (req, resp, _id) {
        //find( { '_id': new ObjectId(id) } )
        db.collection(def.event_col).find({ $and: [{ category: { $eq: event } }] }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    /* Get Event details - home page. */
    exports.getUpcomingEventDetails = function (req, resp, _id) {
        //find( { '_id': new ObjectId(id) } )
        db.collection(def.event_col).find({ $and: [{ category: { $eq: event } }] }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    /* Get One Event detail - home page. */
    exports.getOneEventDetailForHomePage = function (req, resp, _id) {
        db.collection(def.event_col).find({ $and: [{ _id: { $eq: new ObjectId(_id) } }, { category: { $eq: event } }] }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    /* Get Bar details - home page. */
    exports.getBarDetailsForHomePage = function (req, resp, _id) {
        //find( { '_id': new ObjectId(id) } )
        db.collection(def.place_col).find({ $and: [{ category: { $eq: bar } }] }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    /* Get One Bar detail - home page. */
    exports.getOneBarDetailForHomePage = function (req, resp, _id) {
        db.collection(def.place_col).find({ $and: [{ _id: { $eq: new ObjectId(_id) } }, { category: { $eq: bar } }] }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    /* Get Entertainment Place - home page. */
    exports.getEntertainmentPlaceDetailsForHomePage = function (req, resp, _id) {
        //find( { '_id': new ObjectId(id) } )
        db.collection(def.place_col).find({ $and: [{ category: { $eq: entertainment } }] }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    /* Get One Entertainment Place detail - home page. */
    exports.getOneEntertainmentPlaceDetailsForHomePage = function (req, resp, _id) {
        db.collection(def.place_col).find({ $and: [{ _id: { $eq: new ObjectId(_id) } }, { category: { $eq: entertainment } }] }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    /* Get NightClub - home page. */
    exports.getNightClubDetailsForHomePage = function (req, resp, _id) {
        //find( { '_id': new ObjectId(id) } )
        db.collection(def.place_col).find({ $and: [{ category: { $eq: nightclub } }] }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    /* Get One NightClub detail - home page. */
    exports.getOneNightClubDetailsForHomePage = function (req, resp, _id) {
        db.collection(def.place_col).find({ $and: [{ _id: { $eq: new ObjectId(_id) } }, { category: { $eq: nightclub } }] }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    /* Get Restaurent - home page. */
    exports.getRestaurentDetailsForHomePage = function (req, resp, _id) {
        db.collection(def.place_col).find({ $and: [{ category: { $eq: restaurent } }] }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    /* Get One Restaurent detail - home page. */
    exports.getOneRestaurentDetailsForHomePage = function (req, resp, _id) {
        db.collection(def.place_col).find({ $and: [{ _id: { $eq: new ObjectId(_id) } }, { category: { $eq: restaurent } }] }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };

    /* Register user */
    exports.userRegisteration = function (req, resp) {
        var email = req.body.email;
        db.collection(def.user_registeration_col).findOne({ email: email }).then(function (err, records) {
            if (err) {
                resp.end('user already exists');
            } else {
                db.collection(def.user_registeration_col).insert(req.body, function (err, doc) {
                    if (err) throw err;
                    resp.send(doc);
                    //Redirect to login page.
                });
            }
        });
    };

    /* Check user registeration. */
    exports.checkUserRegisteration = function (req, resp) {
        var email = req.body.email;
        db.collection(def.user_registeration_col).findOne({ email: email }).then(function (err, records) {
            if (err) {
                resp.end('user already exists');
            } else {
                //Show a "Log-in" msg and redirect to login page.
                resp.end('user already exists');
            }
        });
    };

    //Needs a parameter for map
    exports.getMapDataForPlaces = function (req, resp) {
        // find( { name: { $eq : "John" } } )
        db.collection(def.place_col).find({}, { lattitude: "admin", longitude: "admin", _id: 0 }).toArray(function (err, records) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            if (records.length < 1) {
                httpmsgs.show204(req, resp, err);
            } else {
                httpmsgs.sendJSON(req, resp, records);
            }
        });
    };
});


/*

    //Find with and condition.
    find({ $and:[ {"category": {$eq: ""}},{"email": {$eq: ""}}]})
    .find({ $and:[ {"name": "John K"},{"email": {$eq: "john@gmail.com"}}]}).pretty()


        .find({"date": { $gt: new Date()}})
        //     var date="2017-01-15T13:50:16.1271".toString().replace(/T/, ' ').replace(/\..+/, '');
        //     var auxCopia=date.split(" ");
        //     date=auxCopia[0];
        //     var hour=auxCopia[1];

        // console.log(date);
        // console.log(hour);
        //     res.end();


*/