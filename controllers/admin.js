var httpmsgs = require("../core/httpMsgs");
var def = require("../core/definations");
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/newList';
var jwt = require('jsonwebtoken');


MongoClient.connect(process.env.MONGODB_URL || url, function (err, db) {
    assert.equal(null, err);
    console.log('Successfully connected to Mongodb.');


    /* Admin Panel API's */

    exports.getRecords = function (req, resp) {
        // find( { name: { $eq : "John" } } )
        db.collection(def.default_col).find({}).toArray(function (err, records) {
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

    exports.postRecords = function (req, resp) {
        console.log(req.body);
        db.collection(def.default_col).insert(req.body, function (err, doc) {
            if (err) {
                httpmsgs.show500(req, resp, err);
            }
            else {
                httpmsgs.sendJSON(req, resp, doc);
            }
        });
    };

    //Needs a parameter for delete
    exports.deleteRecords = function (req, resp, id) {
        console.log("Delete " + id);
        db.collection(def.default_col).deleteOne({ '_id': new ObjectId(id) }, function (err, results) {
            console.log(results);
            res.json(results);
        });
        resp.end();
    };

    //Needs a parameter for update
    exports.updateRecords = function (req, resp, id) {
        db.collection(def.default_col).updateOne(
            { '_id': new ObjectId(id) },
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

    exports.getLogin = function (req, resp) {
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

    exports.getLogout = function (req, resp) {
        resp.cookie('myToken',token, {maxAge:10000});
        resp.clearCookie("myToken");
        resp.end('Logout Successful');
    };

    exports.getDataForEvents = function (req, resp) {
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

    //Needs a parameter for search
    exports.getDataForOneEvent = function (req, resp) {
        // find( { name: { $eq : "John" } } )
        db.collection(def.event_col).find({ name: { $eq: "John" } }).toArray(function (err, records) {
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

    exports.getDataForPlaces = function (req, resp) {
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

    //Needs a parameter for search
    exports.getDataForOnePlace = function (req, resp) {
        db.collection(def.place_col).find({ name: { $eq: "John" } }).toArray(function (err, records) {
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

    //Needs a parameter for map
    exports.getMapDataForPlaces = function (req, resp) {
        // find( { name: { $eq : "John" } } )
        db.collection(def.place_col).find({}, { lattitude: "admin", longitude: "admin", "_id": 0 }).toArray(function (err, records) {
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

    exports.getDataGTtodayForEvent = function (req, resp) {
        db.collection(def.place_col).find({"date": { $gt: new Date()}}).toArray(function (err, records) {
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

.find({"date": { $gt: new Date()}})
//     var date="2017-01-15T13:50:16.1271".toString().replace(/T/, ' ').replace(/\..+/, '');
//     var auxCopia=date.split(" ");
//     date=auxCopia[0];
//     var hour=auxCopia[1];

// console.log(date);
// console.log(hour);
//     res.end();


*/ 