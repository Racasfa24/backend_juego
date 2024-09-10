// EcoBubbles Adventures - Juego multijugador cooperativo 
// Programado y diseñado por: Castillejos Famania Rafael, Ramírez FLores Fabian, Beltrán Moreno Marina Amellaly
// Documentado y asesorado por: Velazquez Carballo Luis Alberto

// Estudiantes de último año de ingeniería de software
//------------- Universidad Autónoma de Baja California Sur ----------------------------

const express = require('express');
const bodyParser = require('body-parser');

const db = require ('./src/data_bases/db');

const app = express();
const configureRouter= require('./src/routes');

const { exec } = require('child_process');
const { stdout } = require('process');

app.use(express.json());
app.use(configureRouter());

app.use(bodyParser.json());

const startGame = () => {
    console.log('Intentando ejecutar el juego...');
    exec('start "" "game.exe"', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error al ejecutar: ${err.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
        if (stdout) {
            console.log(`stdout: ${stdout}`);
        }
        console.log('Juego ejecutado exitosamente.');
    });
}



// Crear tabla de jugadores si no existe
const createTableSql = `
    CREATE TABLE IF NOT EXISTS Players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        highscore INTEGER DEFAULT 0
    );
`;
db.run(createTableSql, [], (err) => {
    if (err) {
        console.log("Error base de datos");
    }

    console.log("El juego está iniciando, por favor no cierres esta ventana");
    startGame();
});


const server = app.listen(8080, '127.0.0.1', () => {
    console.log("Listening at http://127.0.0.1:8080");
});

