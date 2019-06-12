
import './promise';
import * as mysql from 'mysql';
export * from 'mysql';

export interface Connection extends mysql.Connection {
    execute<T extends mysql.RowDataPacket[][] | mysql.RowDataPacket[] | mysql.OkPacket | mysql.OkPacket[]>(sql: string, callback?: (err: mysql.QueryError | null, result: T, fields: mysql.FieldPacket[]) => any): mysql.Query;
    execute<T extends mysql.RowDataPacket[][] | mysql.RowDataPacket[] | mysql.OkPacket | mysql.OkPacket[]>(sql: string, values: any | any[] | { [param: string]: any }, callback?: (err: mysql.QueryError | null, result: T, fields: mysql.FieldPacket[]) => any): mysql.Query;
    execute<T extends mysql.RowDataPacket[][] | mysql.RowDataPacket[] | mysql.OkPacket | mysql.OkPacket[]>(options: mysql.QueryOptions, callback?: (err: mysql.QueryError | null, result: T, fields?: mysql.FieldPacket[]) => any): mysql.Query;
    execute<T extends mysql.RowDataPacket[][] | mysql.RowDataPacket[] | mysql.OkPacket | mysql.OkPacket[]>(options: mysql.QueryOptions, values: any | any[] | { [param: string]: any }, callback?: (err: mysql.QueryError | null, result: T, fields: mysql.FieldPacket[]) => any): mysql.Query;
    ping(callback?: (err: mysql.QueryError | null) => any): void;
}

export interface PoolConnection extends mysql.PoolConnection, Connection {}

export interface Pool extends mysql.Connection {
    execute<T extends mysql.RowDataPacket[][] | mysql.RowDataPacket[] | mysql.OkPacket | mysql.OkPacket[]>(sql: string, callback?: (err: mysql.QueryError | null, result: T, fields: mysql.FieldPacket[]) => any): mysql.Query;
    execute<T extends mysql.RowDataPacket[][] | mysql.RowDataPacket[] | mysql.OkPacket | mysql.OkPacket[]>(sql: string, values: any | any[] | { [param: string]: any }, callback?: (err: mysql.QueryError | null, result: T, fields: mysql.FieldPacket[]) => any): mysql.Query;
    execute<T extends mysql.RowDataPacket[][] | mysql.RowDataPacket[] | mysql.OkPacket | mysql.OkPacket[]>(options: mysql.QueryOptions, callback?: (err: mysql.QueryError | null, result: T, fields?: mysql.FieldPacket[]) => any): mysql.Query;
    execute<T extends mysql.RowDataPacket[][] | mysql.RowDataPacket[] | mysql.OkPacket | mysql.OkPacket[]>(options: mysql.QueryOptions, values: any | any[] | { [param: string]: any }, callback?: (err: mysql.QueryError | null, result: T, fields: mysql.FieldPacket[]) => any): mysql.Query;
    getConnection(callback: (err: NodeJS.ErrnoException, connection: PoolConnection) => any): void;
    on(event: 'connection', listener: (connection: PoolConnection) => any): this;
    on(event: 'acquire', listener: (connection: PoolConnection) => any): this;
    on(event: 'release', listener: (connection: PoolConnection) => any): this;
    on(event: 'enqueue', listener: () => any): this;
}

export interface ConnectionOptions extends mysql.ConnectionOptions {
    charsetNumber?: number;
    compress?: boolean;
    authSwitchHandler?: (data: any, callback: () => void) => any;
    connectAttributes?: { [param: string]: any };
    decimalNumbers?: boolean;
    isServer?: boolean;
    maxPreparedStatements?: number;
    namedPlaceholders?: boolean;
    nestTables?: boolean | string;
    passwordSha1?: string;
    pool?: any;
    rowsAsArray?: boolean;
    stream?: any;
    uri?: string;
    connectionLimit?: number;
    Promise?: any;
    queueLimit?: number;
    waitForConnections?: boolean;
}

export interface PoolOptions extends mysql.PoolOptions, ConnectionOptions {}

export function createConnection(connectionUri: string): Connection;
export function createConnection(config: ConnectionOptions): Connection;
export function createPool(config: PoolOptions): Pool;
