var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection;

require('dotenv').config();

connection = mysql.createPool({
  multipleStatements: true,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

router.get('/', (req, res) => {
  try {
    let ofertas;
    let populares;

    connection.query('CALL ListarOfertas()', (err, data) => {
      if (err) throw err;
      ofertas = {
        ofertas: data[0]
      };

      connection.query('CALL ListarMasPopulares()', (err, data) => {
        if (err) throw err;
        populares = {
          populares: data[0]
        };

        res.render('./pages/index', {
          ofertas,
          populares
        });
      });
    });
  } catch (err) {
    res.end(err);
  }
});

router.get('/cart', (req, res) => {
  try {
    res.render('pages/cart');
  } catch (err) {
    res.end(err);
  }
});

router.get('/category/:cat', (req, res) => {
  try {
    let query = `CALL ListarProductosPorCategoria(${JSON.stringify(req.params.cat)})`;

    connection.query(query, (err, data) => {
      if (err) throw err;
      let obj = {
        productos: data[0]
      };

      res.render('pages/category', obj)
    });
  } catch (err) {
    res.end(err);
  }
});

router.get('/search', (req, res) => {
  try {
    let search = req.query.search;
    let query = `CALL BuscarProductos("${search}")`;

    connection.query(query, (err, data) => {
      if (err) throw err;
      let obj = {
        search: search,
        productos: data[0]
      };
      res.render('pages/search', obj);
    });
  } catch (err) {
    res.end(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    let userName = req.body.email;
    let userPass = req.body.password;
    let query = `CALL LogIn("${userName}", "${userPass}")`;

    connection.query(query, (err, data) => {
      if (err) throw err;

      if (data[0].length > 0) {
        res.redirect('/');
      } else {
        res.end('Nombre de usuario o contraseña inválidos');
      }
    });
  } catch (err) {
    res.end(err);
  }
});

router.get('/signup', async (req, res) => {
  try {
    res.render('./pages/signup');
  } catch (err) {
    res.end(err);
  }
});

router.post('/signup/confirm', async (req, res) => {
  try {
    let user = {
      userFirstName: req.body.nombres,
      userLastName: req.body.apellidos,
      userEmail: req.body.email,
      userPassword: req.body.password
    }

    let query = `CALL AltaUsuario("${user.userFirstName}", "${user.userLastName}", "${user.userEmail}", "${user.userPassword}")`;

    connection.query(query, (err, data) => {
      if (err) throw err;

      else if (data.affectedRows > 0) {
        res.render('./pages/success');
      }
    });

  } catch (err) {
    res.end(err);
  }
});

router.use((req, res) => {
  res.render('./pages/404');
});

module.exports = router;