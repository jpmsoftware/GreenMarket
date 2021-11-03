const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passportLocal = require('passport-local');
const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();

var connection = mysql.createPool({
    multipleStatements: true,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

app.get('/', (req, res) => {

    let ofertas;
    let populares;

    connection.query('CALL ListarOfertas()', (err, data) => {
        if (err) throw err;
        ofertas = { ofertas: data[0] };

        connection.query('CALL ListarMasPopulares()', (err, data) => {
            if (err) throw err;
            populares = { populares: data[0] };
            
            res.render('./pages/index', {
                ofertas,
                populares
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
        res.render('pages/busqueda', obj);
    });
});

app.post('/login', async (req, res) => {
    try {
        let userName = req.body.email;
        let userPass = req.body.password;
        let query = `CALL LogIn("${userName}", "${userPass}")`;

        connection.query(query, (err, data) => {
            if (err) throw err;

            if(data[0].length > 0) {
                res.redirect('/');
            } else {
                res.end('Nombre de usuario o contraseña inválidos');
            }
        });
    } catch (err) {
        res.end(err);
    }
});

app.get('/register', async (req, res) => {
     res.render('./pages/register');
});

app.post('/register/confirm', async (req, res) => {
    let user = null;
    
    try {
        user = {
            userFirstName: req.body.nombres,
            userLastName: req.body.apellidos,
            userEmail: req.body.email,
            userPassword: req.body.password
        }

        let query = `CALL AltaUsuario("${user.userFirstName}", "${user.userLastName}", "${user.userEmail}", "${user.userPassword}")`;

        connection.query(query, (err, data) => {
            if(err) throw err;

            else if(data.affectedRows > 0) {
                res.render('./pages/success');
            }
        });

    } catch(err) {
        res.end(err);
    } 

    
});

app.use((req, res) => {
    res.render('./pages/404');
});