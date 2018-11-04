let mysql = require('mysql');

module.exports = {
    connect: () => {
        let db = mysql.createConnection({
            host     : 'localhost',
            port     : '3307',
            user     : 'userName',
            password : 'password',
            database : 'databaseName'
        });
        return db.connect();
    }
}

/*
db.query('SELECT * FROM g5_board', (err, results, fields) => {
//if (err) throw err;
    console.log('BoardList is: ', results);
});
db.end();
*/