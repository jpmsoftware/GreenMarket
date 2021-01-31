const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();

var connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

app.use(express.static('dist'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {

    console.log(
        process.env.HOST + 
        process.env.USER +
        process.env.PASSWORD +
        process.env.DATABASE
        );

    let ofertas;
    let masvendidos;

    connection.query('CALL ListarOfertas()', (err, data) => {
        if (err) throw err;
        ofertas = { ofertas: data[0] };

        connection.query('CALL ListarMasVendidos()', (err, data) => {
            if (err) throw err;
            masvendidos = { masvendidos: data[0] };
            res.render('index', { ofertas, masvendidos });
        });
    });
});

app.get('/carrito', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/template/carrito.html'));
});

app.get('/categorias/:cat', (req, res) => {
    let query = `CALL ListarProductosPorCategoria(${JSON.stringify(req.params.cat)})`;
    connection.query(query, (err, data) => {
        if (err) throw err;
        let obj = { productos: data[0] };
        res.render('categoria', obj)
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});