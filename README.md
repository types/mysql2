# Typed mysql2

[![Greenkeeper badge](https://badges.greenkeeper.io/types/mysql2.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/types/mysql2.svg?branch=master)](https://travis-ci.org/types/mysql2)

Typescript Typings for [mysql2](https://www.npmjs.com/package/mysql2).

## Installation
```sh
typings install --save mysql2
```
or
```sh
npm install --save-dev types/mysql2#semver:version
```

## Usage

```ts
import {createConnection, QueryError, RowDataPacket} from 'mysql2';

const connection = createConnection(process.env['DB']);

connection.query('SELECT 1 + 1 AS solution', (err: QueryError, rows: RowDataPacket[]) => {
    console.log('The solution is: ', rows[0]['solution']);
});

connection.execute('UPDATE posts SET title = ? WHERE id = ?', ['Hello World', 1], (err: QueryError, result: OkPacket) => {
    console.log(result.affectedRows);
});
```

[More examples](./test)


## Contributing
You can run them the tests with `npm run build` and `npm run test`.

