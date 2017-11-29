/*var sqlDb = require("mysql");
var settings = require("../settings");

exports.executeSql = function (sql, callback) {
    var conn = new sqlDb.createConnection(settings.dbConfig);
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            callback(null, err);
        }

        conn.query(sql, function (err, recordset) {
            if (err) { callback(null, err); }
            else { callback(recordset); } //throw err;
        });

        /*        conn.query(sql,function(err,rows)
                {
                    if(err) throw err;
                    console.log('Data received from Db:\n');
                    callback(rows);
                });
        */
        //var req = new sqlDb.Request(conn);
        /*        conn.query(sql)
                .then(function(recordset){
                     callback(recordset);
                })
                .catch(function(err){
                    console.log(err);
                    callback(null, err);
                });*/
/*    });

};*/