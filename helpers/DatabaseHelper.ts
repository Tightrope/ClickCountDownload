import * as fs from "fs";
import {DailyRollup} from "../models/DailyRollup";
import sqlite3, {Database} from "sqlite3";
import {open} from "sqlite";

export async function createDbConnection(dbFilePath: string) {
    console.info(`Creating connection to database at ${dbFilePath}`);
    return new Database(':memory:', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the in-memory SQlite database.');
    });
    // return open({
    //     filename: dbFilePath,
    //     driver: sqlite3.Database
    // });
}

export async function iterateTable(db: sqlite3.Database, rollupTableName: string): Promise<void> {
    console.info(`Iterating over table ${rollupTableName}`);
    const rows = await db.each(`SELECT * FROM '${rollupTableName}'`, (err, row) => {
        if(err){
            console.error(err);
            Promise.reject(err);
        }
        console.info(`Rollup id: ${row.id}, date: ${row.date}, productId: ${row.productId}, clicks: ${row.clicks}`);
    });
}

export async function populateDatabase(db: sqlite3.Database, dataPath: string, tableName: string): Promise<void> {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8')) as DailyRollup[];

    // Serially create table and seed sqlite database with JSON data
    await db.serialize(() => {
        db.run(`DROP TABLE IF EXISTS ${tableName}`);
        db.run(`CREATE TABLE ${tableName} (id INTEGER PRIMARY KEY, date TEXT, productId INTEGER, clicks INTEGER)`);
        const statement = db.prepare(`INSERT INTO ${tableName} VALUES (?, ?, ?, ?)`);
        for (const row of data) {
            statement.run(row.id, row.date, row.productId, row.clicks);
        }
        statement.finalize();
        console.info(`Successfully populated database table ${tableName} with data from ${dataPath}`);
    });
}

export async function getClickCountsForRange(db: sqlite3.Database, tableName: string, startDate: Date, endDate: Date) {
    // Select rows for the given date range group by date and product id
    // and sum the clicks for each group
    //return new Promise((resolve, reject) => {
    await db.run(`SELECT date, productId, SUM(clicks) AS clicks FROM ${tableName} WHERE date BETWEEN ? AND ? GROUP BY date, productId`,
        [startDate.toISOString(), endDate.toISOString()], (err:any, rows:any) => {
            if (err) {
                throw err;
            }
            return rows;
        });
}
