import {populateDatabase, createDbConnection, iterateTable, getClickCountsForRange} from "./repository/DatabaseHelper";
import * as sqlite3 from "sqlite3";
import {DailyRollup} from "./models/DailyRollup";

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
    let dbConnection= await createDbConnection();
    await populateDatabase(dbConnection, dataPath, rollupTableName);

    const startDate = new Date("2022-10-01T00:00:00-05:00");
    const endDate = new Date("2022-10-02T00:00:00-05:00");
    const rollups: DailyRollup[] = await getClickCountsForRange(dbConnection, rollupTableName, startDate, endDate);
    console.debug(`Retrieved ${rollups.length} click counts for range ${startDate.toISOString()} - ${endDate.toISOString()}`);
    rollups.forEach(rollup => {
        console.log(`Rollup id: ${rollup.id}, date: ${rollup.date}, productId: ${rollup.productId}, clicks: ${rollup.clicks}`);
    });

    await dbConnection.close();
}

main().then(() => {
    console.log("done");
});
