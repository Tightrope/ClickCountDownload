import {populateDatabase, getClickCountsForRange, createDbConnection, iterateTable} from "./helpers/DatabaseHelper";
import * as sqlite3 from "sqlite3";
import path from "path";

const dbFilePath = path.resolve(__dirname, "./data/main.db");
const dataPath = "./data/test_data.json";
const rollupTableName = "DailyRollup";

async function getClicks(){
    const startDate = new Date("2022-10-01");
    const endDate = new Date("2022-10-03");

    // const db = new sqlite3.Database('./data/main.db');
    // const rows = await getClickCountsForRange(db, "DailyRollup", startDate, endDate);
    // console.log(rows);
    // db.close();
}

async function main(){
    sqlite3.verbose();
    let dbConnection= await createDbConnection(dbFilePath);
    //await populateDatabase(dbConnection.getDatabaseInstance(), dataPath, rollupTableName);
    await populateDatabase(dbConnection, dataPath, rollupTableName);
    // await dbConnection.close();

    // Note: Need to close/open database to flush changes to disk before querying
    //dbConnection= await createDbConnection(dbFilePath);
    // await iterateTable(dbConnection.getDatabaseInstance(), rollupTableName);
    await iterateTable(dbConnection, rollupTableName);
    await dbConnection.close();
}

main().then(() => {
    console.log("done");
});
