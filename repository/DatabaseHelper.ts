import * as sqlite3 from "sqlite3";
import * as fs from "fs";
import {DailyRollup} from "../models/DailyRollup";
import {Database, open} from "sqlite";

export async function createDbConnection() {
    return await open({
        filename: ':memory:',
        mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
        driver: sqlite3.Database
        }
    );
}

export async function iterateTable(db: Database, rollupTableName: string): Promise<void> {
    console.info(`Iterating over table ${rollupTableName}`);
    await db.each(`SELECT * FROM '${rollupTableName}'`, (err, row: DailyRollup) => {
        if(err){
            console.error(err);
            Promise.reject(err);
        }
        console.debug(`Rollup id: ${row.id}, date: ${row.date}, productId: ${row.productId}, clicks: ${row.clicks}`);
    });
}

export async function populateDatabase(db: Database, dataPath: string, tableName: string): Promise<void> {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8')) as DailyRollup[];

    await db.run(`DROP TABLE IF EXISTS ${tableName}`);
    await db.run(`CREATE TABLE ${tableName} (id INTEGER PRIMARY KEY, date TEXT, productId INTEGER, clicks INTEGER)`);
    const statement = await db.prepare(`INSERT INTO ${tableName} VALUES (?, ?, ?, ?)`);
    for (const row of data) {
        await statement.run(row.id, row.date, row.productId, row.clicks);
    }
    await statement.finalize();
    console.debug(`Successfully populated database table ${tableName} with data from ${dataPath}`);
}

export async function getClickCountsForRange(db: Database, tableName: string, startDate: Date, endDate: Date): Promise<DailyRollup[]> {
    const rows = await db.all(`SELECT * FROM ${tableName} WHERE date >= ? AND date < ?`, [startDate.toISOString(), endDate.toISOString()]);
    return rows;
}
