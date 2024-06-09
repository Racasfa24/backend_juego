// Conexión a la base de datos

const dbname = "game.db";
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(dbname, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database:', dbname);
});

module.exports = db;