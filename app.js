const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');
const path = require('path');
const dbConfig = require('./app/config/db.config');
const app = express();
const PORT = process.env.PORT || 3000;

var connection = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

app.use(express.static(path.join(__dirname, '/dist')));

app.use('/dist', express.static(path.join(__dirname, '/dist')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    let ofertas;
    let masvendidos;

    connection.query('CALL ListarOfertas()', (err, results) => {
        if (err) throw err;
        ofertas = { ofertas: results[0] };
    });

    connection.query('CALL ListarMasVendidos()', (err, results) => {
        if (err) throw err;
        masvendidos = { masvendidos: results[0] };
        res.render('index', { ofertas, masvendidos });
    });
});

app.get('/index', (req, res) => {
    connection.query('CALL ListarOfertas()', (err, results) => {
        if (err) throw err;

        let obj = { ofertas: results[0] };
        res.render('index', obj);
    });

    connection.query('CALL ListarMasVendidos()', (err, results) => {
        if (err) throw err;
        let obj_masvendidos = { masvendidos: results[0] };
    });
});

app.get('/ofertas', (req, res) => {
    let query = 'CALL ListarOfertas()';
    connection.query(query, (err, results) => {
        if (err) throw err;
        let obj = { ofertas: results[0] };
        res.render('ofertas', obj);
    });
});

app.get('/masvendidos', (req, res) => {
    let query = 'CALL ListarMasVendidos()';
    connection.query(query, (err, results) => {
        if (err) throw err;
        let obj = { masvendidos: results[0] };
        res.render('masvendidos', obj);
    });
});

app.get('/carrito', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/template/carrito.html'));
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});