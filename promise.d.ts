
import {RowDataPacket, OkPacket, FieldPacket, QueryOptions, ConnectionOptions, PoolOptions} from './index';
import {EventEmitter} from 'events';
export * from './index';

export interface Connection extends EventEmitter {

    config: ConnectionOptions;
    threadId: number;

    connect(): Promise<void>;

    beginTransaction(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;

    changeUser(options: ConnectionOptions): Promise<void>;

    query(sql: string): Promise<[RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[], FieldPacket[]]>;
    query(sql: string, values: any | any[] | { [param: string]: any }): Promise<[RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[], FieldPacket[]]>;
    query(options: QueryOptions): Promise<[RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[], FieldPacket[]]>;
    query(options: QueryOptions, values: any | any[] | { [param: string]: any }): Promise<[RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[], FieldPacket[]]>;

    execute(sql: string): Promise<[RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[], FieldPacket[]]>;
    execute(sql: string, values: any | any[] | { [param: string]: any }): Promise<[RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[], FieldPacket[]]>;
    execute(options: QueryOptions): Promise<[RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[], FieldPacket[]]>;
    execute(options: QueryOptions, values: any | any[] | { [param: string]: any }): Promise<[RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[], FieldPacket[]]>;

    end(options?: any): Promise<void>;

    destroy(): void;

    pause(): void;

    resume(): void;

    escape(value: any): string;

    escapeId(value: string): string;
    escapeId(values: string[]): string;

    format(sql: string, values?: any | any[] | { [param: string]: any }): string;
}

export interface PoolConnection extends Connection {
    release(): void;
}

export interface Pool extends EventEmitter {
    query(sql: string): Promise<[RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[], FieldPacket[]]>;
    query(sql: string, values: any | any[] | { [param: string]: any }): Promise<[RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[], FieldPacket[]]>;
    query(options: QueryOptions): Promise<[RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[], FieldPacket[]]>;
    query(options: QueryOptions, values: any | any[] | { [param: string]: any }): Promise<[RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[], FieldPacket[]]>;

    execute(sql: string): Promise<[RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[], FieldPacket[]]>;
    execute(sql: string, values: any | any[] | { [param: string]: any }): Promise<[RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[], FieldPacket[]]>;
    execute(options: QueryOptions): Promise<[RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[], FieldPacket[]]>;
    execute(options: QueryOptions, values: any | any[] | { [param: string]: any }): Promise<[RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[], FieldPacket[]]>;

    getConnection(): Promise<PoolConnection>;
    on(event: 'connection', listener: (connection: PoolConnection) => any): this;
}

export function createConnection(connectionUri: string): Connection;
export function createConnection(config: ConnectionOptions): Connection;
export function createPool(config: PoolOptions): Pool;
