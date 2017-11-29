//var mysql = require('mysql');
/*
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'rahul',
    database : 'login_user'
});

connection.connect(function(err){
    if (err) throw err;
});

module.exports = connection;
*/

exports.dbConfig = {
    host     : 'localhost',
    user     : 'root',
    password : 'rahul',
    database : 'myclub'
};

exports.httpMsgsFormat = "HTML";