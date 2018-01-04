var httpmsgs = require("../core/httpMsgs");
var def = require("../core/definations");
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/newList';
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var bar = 'bar', place = 'place',
    entertainment = 'entertainment',
    restaurent = 'restaurent',
    nightclub = 'nightclub',
    event = 'event',
    category = 'category',
    _id = '_id',
    _email, hashedString;


MongoClient.connect(process.env.MONGODB_URL || url, function (err, db) {
    assert.equal(null, err);
    console.log('Successfully connected to Mongodb.');

    /* Admin Panel API's start. */
    //post
    exports.getLoginForAdmin = function (req, resp) {
        // var uname = req.body.username;
        var pass = req.body.password;
        var email = req.body.email;
        var hashedPass;

        //db.admin.find({$where: "this.username = 'admin'"})
        //{ username: { $eq: uname }, password: { $eq: hashedPass }
        db.collection(def.admin_col).find({ $where: "this.email = '" + email + "'" }).toArray(function (err, records) {
            if (resp.clearCookie("myToken")) {
                console.log('yes');
            } else {
                console.log('no');
            }
            bcrypt.compare(pass, records[0].password, function (err, result) {
                if (err) {
                    httpmsgs.show500(req, resp, err);
                    console.log(' cannot login');
                }
                else if (result) {
                    _email = { email: email }; //!! find the user and check user from db then
                    var token = jwt.sign(_email, 'secret');
                    resp.cookie('myToken', token);
                    resp.clearCookie("myToken");
                    // resp.cookie('myToken', token, { maxAge: 10000 });
                    console.log(req.headers.cookie);
                    resp.end('Login Successful');
                } else {
                    resp.end('Invalid Username or Password.');
                }
                console.log(result);
            });
        });
    };

    //post
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
    exports.getSinglePlaceDetailsForAdmin = function (req, resp, id) {
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
    exports.deletePlaceDetailsForAdmin = function (req, resp, id) {
        db.collection(def.place_col).deleteOne({ _id: new ObjectId(id) }, function (err, results) {
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
    exports.getOnePlaceDetailForHomePage = function (req, resp, id) {
        // find({ $and:[ {_id: {$eq: new ObjectId(_id)}},{category: {$eq: ""}}]})
        db.collection(def.place_col).find({ $and: [{ _id: { $eq: new ObjectId(id) } }, { category: { $eq: place } }] }).toArray(function (err, records) {
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

    /* Get events happening at a place. */
    exports.getEventsHappeningAtPlace = function (req, resp, id) {
        // find({ $and:[ {"category": {$eq: ""}},{"email": {$eq: ""}}]})
        db.collection(def.place_col).find({ $and: [{ category: { $eq: "event" } }, { _id: { $eq: new ObjectId(id) } }] }).toArray(function (err, records) {
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
    exports.getEventDetailsForHomePage = function (req, resp) {
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

    /* Get Upcoming Event details - home page. */
    exports.getUpcomingEventDetails = function (req, resp) {
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
    exports.getOneEventDetailForHomePage = function (req, resp, id) {
        db.collection(def.event_col).find({ $and: [{ _id: { $eq: new ObjectId(id) } }, { category: { $eq: event } }] }).toArray(function (err, records) {
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
    exports.getBarDetailsForHomePage = function (req, resp) {
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
    exports.getOneBarDetailForHomePage = function (req, resp, id) {
        db.collection(def.place_col).find({ $and: [{ _id: { $eq: new ObjectId(id) } }, { category: { $eq: bar } }] }).toArray(function (err, records) {
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
    exports.getEntertainmentPlaceDetailsForHomePage = function (req, resp) {
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
    exports.getOneEntertainmentPlaceDetailsForHomePage = function (req, resp, id) {
        db.collection(def.place_col).find({ $and: [{ _id: { $eq: new ObjectId(id) } }, { category: { $eq: entertainment } }] }).toArray(function (err, records) {
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
    exports.getNightClubDetailsForHomePage = function (req, resp) {
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
    exports.getOneNightClubDetailsForHomePage = function (req, resp, id) {
        db.collection(def.place_col).find({ $and: [{ _id: { $eq: new ObjectId(id) } }, { category: { $eq: nightclub } }] }).toArray(function (err, records) {
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
    exports.getRestaurentDetailsForHomePage = function (req, resp) {
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
    exports.getOneRestaurentDetailsForHomePage = function (req, resp, id) {
        db.collection(def.place_col).find({ $and: [{ _id: { $eq: new ObjectId(id) } }, { category: { $eq: restaurent } }] }).toArray(function (err, records) {
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
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            if (err) { throw (err); return; }
            var hashed_pass, hashed_uname, hashed_email;

            var newUser = {
                username: req.body.username,
                password: hash,
                email: req.body.email
            };

            bcrypt.hash(req.body.email, 8, function (err, _email) {
                hashed_email = _email;
            });

            bcrypt.hash(req.body.username, 8, function (err, _uname) {
                hashed_uname = _uname;
            });

            db.collection(def.user_registration_col).findOne({ username: req.body.username }).then(function (err, records) {
                if (err) {
                    resp.end('user already exists');
                } else {
                    db.collection(def.user_registration_col).insert(newUser, function (err, doc) {
                        if (err) throw err;
                        resp.send(doc);
                        //Redirect to login page.
                    });
                    hashedString = hashed_uname + hashed_pass + hashed_email;
                    console.log(hashedString);
                }
            });
        });
    };

    exports.goingNotgoingMaybe = function (req, resp) {
        // var userid = obj.userid,
        //     eventid = obj.eventid,
        //     _string = obj._string;
        var obj = {
            useremail: req.body.useremail,
            eventid: req.body.eventid,
            _string: req.body.str,
        };

        db.collection(def.event_attending_col).update(
            { eventid: req.body.eventid },
            {
                $set: obj
            },
            { upsert: true },
            function (err, results) {
                // console.log(results);
                // resp.json(results);
            });

        resp.end();
        console.log(obj);
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

    exports.eventPhotography = function (req, resp) {
        //storage
        const storage = multer.diskStorage({
            destination: './public/uploads',
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        });
        //init upload
        const upload = multer({

            storage: storage,
            limits: { fileSize: 2000000 },
            fileFilter: function (req, file, cb) {
                checkFileType(file, cb);
            }

        }).single('myFileUpload');

        function checkFileType(file, cb) {
            const filetypes = /jpeg|jpg|png|gif/;

            const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

            const mimetype = filetypes.test(file.mimetype);

            if (mimetype && extname) {
                return cb(null, true);
            } else {
                cb('error:Images only');
            }
        }
        upload(req, res, (err) => {
            if (err) {
                res.render('index', {
                    msg: err
                });
            } else {
                if (req.file == undefined) {
                    res.render('index', {
                        msg: 'error: no file selected'
                    });
                } else {
                    res.render('index', {
                        msg: 'file uploaded',
                        file: '../images/${req.file.filename}'
                    });
                }
            }
        });
    }
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

/**
 * bcrypt.hash('mypassword', 10, function(err, hash) {
    if (err) { throw (err); }

    bcrypt.compare('mypassword', hash, function(err, result) {
        if (err) { throw (err); }
        console.log(result);
    });
});
 */


//Email Verification for user/any....
/**
     var express=require('express');
    var nodemailer = require("nodemailer");
    var app=express();
        Here we are configuring our SMTP Server details.
        STMP is mail server which is responsible for sending and recieving email.
    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "Your Gmail ID",
            pass: "Gmail Password"
        }
    });
    var rand,mailOptions,host,link;
    ------------------SMTP Over-----------------------------

    ------------------Routing Started ------------------------

    app.get('/',function(req,res){
        res.sendfile('index.html');
    });
    app.get('/send',function(req,res){
            rand=Math.floor((Math.random() * 100) + 54);
        host=req.get('host');
        link="http://"+req.get('host')+"/verify?id="+rand;
        mailOptions={
            to : req.query.to,
            subject : "Please confirm your Email account",
            html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
        }
        console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
                console.log(error);
            res.end("error");
        }else{
                console.log("Message sent: " + response.message);
            res.end("sent");
            }
    });
    });

    app.get('/verify',function(req,res){
    console.log(req.protocol+":/"+req.get('host'));
    if((req.protocol+"://"+req.get('host'))==("http://"+host))
    {
        console.log("Domain is matched. Information is from Authentic email");
        if(req.query.id==rand)
        {
            console.log("email is verified");
            res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
        }
        else
        {
            console.log("email is not verified");
            res.end("<h1>Bad Request</h1>");
        }
    }
    else
    {
        res.end("<h1>Request is from unknown source");
    }
    });
 */