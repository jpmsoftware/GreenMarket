const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
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
app.use(express.urlencoded({
    extended: false
}));

app.set('view engine', 'ejs');

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

app.get('/', (req, res) => {

    let ofertas;
    let masvendidos;

    connection.query('CALL ListarOfertas()', (err, data) => {
        if (err) throw err;
        ofertas = {
            ofertas: data[0]
        };

        connection.query('CALL ListarMasVendidos()', (err, data) => {
            if (err) throw err;
            masvendidos = {
                masvendidos: data[0]
            };
            res.render('./pages/index', {
                ofertas,
                masvendidos
            });
        });
    });
});

app.get('/carrito', (req, res) => {
    res.render('pages/carrito');
});

app.get('/categorias/:cat', (req, res) => {
    let query = `CALL ListarProductosPorCategoria(${JSON.stringify(req.params.cat)})`;
    connection.query(query, (err, data) => {
        if (err) throw err;
        let obj = {
            productos: data[0]
        };
        res.render('pages/categoria', obj)
    });
});

app.get('/search', (req, res) => {
    let search = req.query.search;
    let query = `CALL BuscarProductos("${search}")`;
    connection.query(query, (err, data) => {
        if (err) throw err;
        let obj = {
            search: search,
            productos: data[0]
        };
        res.render('pages/searchResults', obj);
    });
});

app.post('/login', async (req, res) => {
    try {
        let usermail = req.body.usermail;
        let userpass = req.body.userpass;

        let hashedUSerMail = await bcrypt.hash(usermail, 10);

        console.log(hashedUSerMail.length);
        console.log(Date.now().toString());
        res.end();
    } catch (err) {

    }
});

app.use((req, res) => {
    res.render('./pages/404');
});