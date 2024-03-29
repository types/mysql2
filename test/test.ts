
import * as fs from 'fs';
import * as mysql from 'mysql2';
import * as stream from 'stream';

// Connections
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'secret'
});

connection.connect();
connection.ping();

connection.query('SELECT 1 + 1 AS solution', function (err: mysql.QueryError, rows: mysql.RowDataPacket[], fields: mysql.FieldPacket) {
    if (err) {
        throw err;
    }

    console.log('The solution is: ', rows[0]['solution']);
});

connection.execute('SELECT 1 + 1 AS solution', function (err: mysql.QueryError, rows: mysql.RowDataPacket[], fields: mysql.FieldPacket) {
    if (err) {
        throw err;
    }

    console.log('The solution is: ', rows[0]['solution']);
});

// multipleStatements

connection.query('SELECT 1 AS x; SELECT 1 AS x; SELECT 1 AS x', function (err: mysql.QueryError, rows: mysql.RowDataPacket[][], fields: mysql.FieldPacket) {
    if (err) {
        throw err;
    }

    console.log(rows[0][0]['x']);
    console.log(rows[1][0]['x']);
    console.log(rows[2][0]['x']);
});

connection.end();

connection = mysql.createConnection({
    host: 'example.org',
    user: 'bob',
    password: 'secret'
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

connection.query('SELECT 1', function (err, rows) {
    // connected! (unless `err` is set)
});

connection = mysql.createConnection({
    host: 'localhost',
    ssl: {
        ca: ''
    }
});

connection = mysql.createConnection({
    host: 'localhost',
    ssl: {
        // DO NOT DO THIS
        // set up your ca correctly to trust the connection
        rejectUnauthorized: false
    }
});

connection.end(function (err) {
    // The connection is terminated now
});

connection.destroy();

connection.changeUser({ user: 'john' }, function (err) {
    if (err) {
        throw err;
    }
});

let userId = 'some user provided value';
let sql = 'SELECT * FROM users WHERE id = ' + connection.escape(userId);
connection.query(sql, function (err, results) {
    // ...
});
connection.query('SELECT * FROM users WHERE id = ?', [userId], function (err, results) {
    // ...
});

let post = { id: 1, title: 'Hello MySQL' };
let query = connection.query('INSERT INTO posts SET ?', post, function (err, result) {
    // Neat!
});
console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'

let queryStr = 'SELECT * FROM posts WHERE title=' + mysql.escape('Hello MySQL');

console.log(queryStr); // SELECT * FROM posts WHERE title='Hello MySQL'

let sorter = 'date';
sql = 'SELECT * FROM posts ORDER BY ' + connection.escapeId(sorter);
connection.query(sql, function (err, results) {
    // ...
});

sql = 'SELECT * FROM posts ORDER BY ' + connection.escapeId('posts.' + sorter);
connection.query(sql, function (err, results) {
    // ...
});

let userIdNum = 1;
let columns = ['username', 'email'];
query = connection.query('SELECT ?? FROM ?? WHERE id = ?', [columns, 'users', userIdNum], function (err, results) {
    // ...
});

console.log(query.sql); // SELECT `username`, `email` FROM `users` WHERE id = 1

sql = 'SELECT * FROM ?? WHERE ?? = ?';
let inserts = ['users', 'id', userId];
sql = mysql.format(sql, inserts);

sql = 'INSERT INTO posts SET ?';
post = { id: 1, title: 'Hello MySQL' };
sql = mysql.format(sql, post);

connection.config.queryFormat = function (query, values) {
    if (!values) {
        return query;
    }
    return query.replace(/\:(\w+)/g, function (txt: string, key: string) {
        if (values.hasOwnProperty(key)) {
            return this.escape(values[key]);
        }
        return txt;
    }.bind(this));
};

connection.query('UPDATE posts SET title = :title', { title: 'Hello MySQL' });

let s: stream.Readable = connection.query('UPDATE posts SET title = :title', { title: 'Hello MySQL' }).stream({ highWaterMark: 5 });

connection.query('INSERT INTO posts SET ?', { title: 'test' }, function (err: mysql.QueryError, result: mysql.OkPacket) {
    console.log(result.insertId);
});

connection.query('DELETE FROM posts WHERE title = "wrong"', function (err: mysql.QueryError, result: mysql.OkPacket) {
    console.log('deleted ' + result.affectedRows + ' rows');
});

connection.query('UPDATE posts SET ...', function (err: mysql.QueryError, result: mysql.OkPacket) {
    console.log('changed ' + result.changedRows + ' rows');
});

connection.connect(function (err) {
   console.log('connected as id ' + connection.threadId);
});

/// Pools

let poolConfig = {
    connectionLimit: 10,
    host: 'example.org',
    user: 'bob',
    password: 'secret'
};

let pool = mysql.createPool(poolConfig);

pool.query('SELECT 1 + 1 AS solution', function (err: mysql.QueryError, rows: mysql.RowDataPacket[], fields: mysql.FieldPacket) {
    if (err) {
        throw err;
    }

    console.log('The solution is: ', rows[0]['solution']);
});

pool.execute('SELECT 1 + 1 AS solution', function (err: mysql.QueryError, rows: mysql.RowDataPacket[], fields: mysql.FieldPacket) {
    if (err) {
        throw err;
    }

    console.log('The solution is: ', rows[0]['solution']);
});

pool = mysql.createPool({
    host: 'example.org',
    user: 'bob',
    password: 'secret'
});

pool.getConnection(function (err, connection) {
    // connected! (unless `err` is set)
});

pool.on('connection', function (connection) {
    connection.query('SET SESSION auto_increment_increment=1');
});

pool.getConnection(function (err, connection) {
    // Use the connection
    connection.query('SELECT something FROM sometable', function (err, rows) {
        // And done with the connection.
        connection.release();

        // Don't use the connection here, it has been returned to the pool.
    });
});

pool = mysql.createPool('https://example.org/mysql/db');

pool.getConnection(function (err, connection) {
    // connected! (unless `err` is set)
});

pool.on('connection', function (connection) {
    connection.query('SET SESSION auto_increment_increment=1');
});

pool.getConnection(function (err, connection) {
    // Use the connection
    connection.query('SELECT something FROM sometable', function (err, rows) {
        // And done with the connection.
        connection.release();

        // Don't use the connection here, it has been returned to the pool.
    });
});

/// PoolClusters

// create
let poolCluster = mysql.createPoolCluster();

let poolClusterConfig = {
    canRetry: true,
    removeNodeErrorCount: 2,
    restoreNodeTimeout: 3,
    defaultSelector: 'RANDOM'
};

poolCluster.add(poolClusterConfig); // anonymous group
poolCluster.add('MASTER', poolClusterConfig);
poolCluster.add('SLAVE1', poolClusterConfig);
poolCluster.add('SLAVE2', poolClusterConfig);

// Target Group : ALL(anonymous, MASTER, SLAVE1-2), Selector : round-robin(default)
poolCluster.getConnection(function (err, connection) { });

// Target Group : MASTER, Selector : round-robin
poolCluster.getConnection('MASTER', function (err, connection) { });

// Target Group : SLAVE1-2, Selector : order
// If can't connect to SLAVE1, return SLAVE2. (remove SLAVE1 in the cluster)
poolCluster.on('remove', function (nodeId) {
    console.log('REMOVED NODE : ' + nodeId); // nodeId = SLAVE1
});

poolCluster.getConnection('SLAVE*', 'ORDER', function (err, connection) { });

// of namespace : of(pattern, selector)
poolCluster.of('*').getConnection(function (err, connection) { });

const cluster = poolCluster.of('SLAVE*', 'RANDOM');
pool.getConnection(function (err, connection) { });
pool.getConnection(function (err, connection) { });

let poolClusterWithOptions = mysql.createPoolCluster({
    canRetry: true,
    removeNodeErrorCount: 3,
    restoreNodeTimeout: 1000,
    defaultSelector: 'RR'
});

// destroy
poolCluster.end();

// Queries

query = connection.query('SELECT * FROM posts');
query
    .on('error', function (err: NodeJS.ErrnoException) {
        // Handle error, an 'end' event will be emitted after this as well
    })
    .on('fields', function (fields: any) {
        // the field packets for the rows to follow
    })
    .on('result', function (row: any) {
        // Pausing the connnection is useful if your processing involves I/O
        connection.pause();

        let processRow = (row: any, cb: () => void) => {
            cb();
        };

        processRow(row, function () {
            connection.resume();
        });
    })
    .on('end', function () {
        // all rows have been received
    });

let writable = fs.createWriteStream('file.txt');
connection.query('SELECT * FROM posts')
    .stream({ highWaterMark: 5 })
    .pipe(writable);

connection = mysql.createConnection({ multipleStatements: true });

connection.query('SELECT 1; SELECT 2', function (err: mysql.QueryError, results: mysql.RowDataPacket) {
    // `results` is an array with one element for every statement in the query:
    console.log(results[0]); // [{1: 1}]
    console.log(results[1]); // [{2: 2}]
});

query = connection.query('SELECT 1; SELECT 2');

query
    .on('fields', function (fields, index) {
        // the fields for the result rows that follow
    })
    .on('result', function (row, index) {
        // index refers to the statement this result belongs to (starts at 0)
    });

let options = { sql: '...', nestTables: true };

connection.query(options, function (err, results) {
    /* results will be an array like this now:
    [{
      table1: {
        fieldA: '...',
        fieldB: '...',
      },
      table2: {
        fieldA: '...',
        fieldB: '...',
      },
    }, ...]
    */
});

connection.beginTransaction(function (err) {
    let title = 'title';

    if (err) { throw err; }
    connection.query('INSERT INTO posts SET title=?', title, function (err: mysql.QueryError, result: mysql.OkPacket) {
        if (err) {
            connection.rollback(function () {
                throw err;
            });
        }

        let log = 'Post ' + result.insertId + ' added';

        connection.query('INSERT INTO log SET data=?', log, function (err, result) {
            if (err) {
                connection.rollback(function () {
                    throw err;
                });
            }
            connection.commit(function (err) {
                if (err) {
                    connection.rollback(function () {
                        throw err;
                    });
                }
                console.log('success!');
            });
        });
    });
});

// Kill query after 60s
connection.query({ sql: 'SELECT COUNT(*) AS count FROM big_table', timeout: 60000 }, function (err: mysql.QueryError, rows: mysql.RowDataPacket[]) {
    if (err && err.code === 'PROTOCOL_SEQUENCE_TIMEOUT') {
        throw new Error('too long to count table rows!');
    }

    if (err) {
        throw err;
    }

    console.log(rows[0]['count'] + ' rows');
});

connection = mysql.createConnection({
    port: 84943 // WRONG PORT
});

connection.connect(function (err) {
    if (err) {
        console.log(err.code); // 'ECONNREFUSED'
        console.log(err.fatal); // true
    }
});

connection.query('SELECT 1', function (err) {
    if (err) {
        console.log(err.code); // 'ECONNREFUSED'
        console.log(err.fatal); // true
    }
});

connection.query('USE name_of_db_that_does_not_exist', function (err, rows) {
    if (err) {
        console.log(err.code); // 'ER_BAD_DB_ERROR'
    }
});

connection.query('SELECT 1', function (err: mysql.QueryError | null, rows: mysql.RowDataPacket[]) {
    console.log(err); // null
    console.log(rows.length); // 1
});

connection.on('error', function (err: NodeJS.ErrnoException | null) {
    if (err) {
        console.log(err.code); // 'ER_BAD_DB_ERROR'
    }
});

connection.query('USE name_of_db_that_does_not_exist');

// I am Chuck Norris:
connection.on('error', function () {
    // ignore
});

connection = mysql.createConnection({ typeCast: false });

query = connection.query({ sql: '...', typeCast: false }, function (err, results) {
    //
});

connection.query({
    sql: '...',
    typeCast: function (field: any, next: Function) {
        if (field.type === 'TINY' && field.length === 1) {
            return (field.string() === '1'); // 1 = true, 0 = false
        }
        return next();
    }
});

connection = mysql.createConnection('mysql://localhost/test?flags=-FOUND_ROWS');
connection = mysql.createConnection({ debug: true });
connection = mysql.createConnection({ debug: ['ComQueryPacket', 'RowDataPacket'] });
