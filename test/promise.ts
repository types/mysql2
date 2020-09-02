
import * as promise from '../promise';

// Connections
async function testConnections() {
    let connection = await promise.createConnection({
        host: 'localhost',
        user: 'me',
        password: 'secret'
    });

    connection.connect()
        .then(() => connection.query<promise.RowDataPacket[]>('SELECT 1 + 1 AS solution'))
        .then(([rows, fields]) => {
            console.log('The solution is: ', rows[0]['solution']);
        });

    connection.connect()
        .then(() => connection.execute<promise.RowDataPacket[]>('SELECT 1 + 1 AS solution'))
        .then(([rows, fields]) => {
            console.log('The solution is: ', rows[0]['solution']);
        });
}

/// Pools

let poolConfig = {
    connectionLimit: 10,
    host: 'example.org',
    user: 'bob',
    password: 'secret'
};

let pool = promise.createPool(poolConfig);

pool.query<promise.RowDataPacket[]>('SELECT 1 + 1 AS solution')
    .then(([rows, fields]) => {
        console.log('The solution is: ', rows[0]['solution']);
    });

pool.execute<promise.RowDataPacket[]>('SELECT 1 + 1 AS solution')
    .then(([rows, fields]) => {
        console.log('The solution is: ', rows[0]['solution']);
    });

async function test() {
    const connection = await pool.getConnection();
    // Use the connection
    await connection.ping();
    const rows = await connection.query('SELECT something FROM sometable');
    // And done with the connection.
    connection.release();
}
