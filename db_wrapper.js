// Wrapper for mysql object, to avoid callback hell
//
// Example usage:
//
//     let query = 'My awesome query';
//
//     database.query(query, [..., ...])
//     .then(rows => {
//         ...
//         return database.query(query, [..., ...]);
//     })
//     .then(rows => {
//         ...


class Database {
    constructor(mysql, config) {
        this.connection = mysql.createConnection(config);
    }
    query(sql, args) {
        return new Promise( (resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err) return reject(err);
                resolve( rows );
            });
        });
    }
    close() {
        return new Promise( (resolve, reject) => {
            this.connection.end( err => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}


module.exports = {Database};
