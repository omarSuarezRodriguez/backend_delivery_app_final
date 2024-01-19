const mysql = require ('mysql');

const db = mysql.createConnection({
    //host: '127.0.0.1',  // Es la Ip local
    host: 'localhost',
    user: 'root',
    password: 'martin1',
    database: 'udemy_delivery'
});


db.connect(function(err) {

    if (err) throw err;
    console.log('Database Connected!');

});

module.exports = db;