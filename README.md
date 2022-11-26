# Click Count Rollup

## Description
---
Simple console app to test how click count rollup works with different time zones.


## Notes
---  
* [Cannot await for sqlite3.Database.get() function completion in Node.js](https://stackoverflow.com/questions/62456867/cannot-await-for-sqlite3-database-get-function-completion-in-node-js)   
  "Since you want to use async/await, and the node-sqlite3 (sqlite3) library does not support the Promise API, you need to use the node-sqlite (sqlite) library, which is a wrapper over sqlite3 and adds support for the Promise API."

## References
---
* [SQLite SQL](https://www.sqlite.org/lang.html)
* [SQLite Tutorial](https://www.sqlitetutorial.net/)