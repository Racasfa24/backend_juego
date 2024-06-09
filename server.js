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

const startGame =() =>{

    exec('start "" "game.exe"', function (err,srdout, stderr ) {

        if(err){

            console.error(err);
            return;

        }
        console.log(stdout);

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
        console.error(err.message);
    }

    console.log("El juego está iniciando, por favor no cierres esta ventana");
    startGame();
});


const server = app.listen(8080, '0.0.0.0', () => {
    console.log("Listening at http://0.0.0.0:8080");
});
