const db = require('../data_bases/db');
const bcrypt = require('bcrypt');

// Endpoint: Registrar jugador
const registerPlayer = (req, res) => {
    const { name, password } = req.body;
    // Generar un hash de la contraseña
    const hash = bcrypt.hashSync(password, 10); // Asegúrate de usar un salt adecuado
    const sql = 'INSERT INTO Players (name, password) VALUES (?, ?)';
    const params = [name, hash];

    db.run(sql, params, function (err) {
        res.json({ id: this.lastID });
    });
};


// Endpoint: Autenticar jugador
const autenticatePlayer = (req, res) => {
    const { name, password } = req.body; // Usamos req.body para obtener los datos
    const sql = 'SELECT * FROM Players WHERE name = ?';
    const params = [name];

    db.get(sql, params, (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(400).json({ error: err.message });
            return;
        }

        try {
            if (row && typeof row.password === 'string') {
                // Verificar la contraseña solo si row y row.password son válidos
                if (bcrypt.compareSync(password, row.password)) {

                    res.json({ id: row.id, name: row.name, highscore: row.highscore });
                    console.log("Welcome back!!");

                } else {
                    res.status(400).json({ error: 'Invalid name or password' });
                }
            } else {
                res.status(400).json({ error: 'Invalid user or password' });
            }
        } catch (error) {
            console.error('Error al comparar contraseñas:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};

// Endpoint: Obtener todos los jugadores
const postPlayers = (req, res) => {
    const sql = 'SELECT id, name, highscore, time_played FROM Players';
    const params = [];

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ players: rows });
    });

    console.log("Fetched some rows");
};

// Endpoint: Obtener jugador por ID
const getPlayer = (req, res) => {
    const sql = 'SELECT id, name, highscore FROM Players WHERE id = ?';
    const params = [req.params.id];

    db.get(sql, params, (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(400).json({ error: err.message });
            return;
        }
        res.json(row);
    });
};

// Endpoint: Actualizar highscore y tiempo jugado
const updateHighscore = (req, res) => {
    const { id, highscore, time_played } = req.body; // Añadimos timePlayed a la solicitud
    const sql = `
        UPDATE Players 
        SET highscore = ?, time_played = ? 
        WHERE id = ? AND highscore < ?
    `;
    const params = [highscore, time_played, id, highscore];

    db.run(sql, params, function (err) {
        if (err) {
            console.error(err.message);
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ changes: this.changes });
        console.log("Highscore and time_played updated");
    });
};


// Endpoint: Eliminar jugador por ID
const deletePlayer = (req, res) => {
    const sql = 'DELETE FROM Players WHERE id = ?';
    const params = [req.params.id];

    db.run(sql, params, (err) => {
        if (err) {
            console.error(err.message);
            res.status(400).json({ error: err.message });
            return;
        }
        console.log("Deleted player with id", req.params.id);
        res.end();
    });
};

module.exports = {
    registerPlayer, 
    autenticatePlayer
    ,postPlayers, 
    getPlayer, 
    updateHighscore,
    deletePlayer
}